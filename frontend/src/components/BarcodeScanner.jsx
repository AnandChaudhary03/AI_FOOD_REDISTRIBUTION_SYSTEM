import { useEffect, useRef, useState } from 'react'
import Quagga from 'quagga'
import { Camera, X, RefreshCw, Sparkles, Search } from 'lucide-react'

export default function BarcodeScanner({ onDetected, onClose, inline = false }) {
  const scannerRef = useRef(null)
  const videoRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [error, setError] = useState(null)
  const [nativeDetectorUsed, setNativeDetectorUsed] = useState(false)

  // 1. Try Native Hardware BarcodeDetector API (Android Chrome / iOS Safari)
  useEffect(() => {
    let nativeInterval = null
    let activeStream = null

    if ('BarcodeDetector' in window) {
      setNativeDetectorUsed(true)
      const detector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf', 'qr_code']
      })

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: { exact: facingMode } } })
        .catch(() => navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }))
        .then((stream) => {
          activeStream = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
          }

          nativeInterval = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await detector.detect(videoRef.current)
                if (barcodes && barcodes.length > 0) {
                  const detectedCode = barcodes[0].rawValue
                  if (detectedCode) {
                    clearInterval(nativeInterval)
                    if (activeStream) {
                      activeStream.getTracks().forEach(t => t.stop())
                    }
                    onDetected(detectedCode)
                  }
                }
              } catch (e) {}
            }
          }, 180)
        })
        .catch((err) => {
          console.warn('Native BarcodeDetector camera error, falling back to Quagga:', err)
          setNativeDetectorUsed(false)
        })

      return () => {
        if (nativeInterval) clearInterval(nativeInterval)
        if (activeStream) activeStream.getTracks().forEach(t => t.stop())
      }
    }
  }, [facingMode, onDetected])

  // 2. QuaggaJS Fallback Engine for legacy browsers
  useEffect(() => {
    if (nativeDetectorUsed || !scannerRef.current) return

    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            width: { min: 640, ideal: 1280 },
            height: { min: 480, ideal: 720 },
            facingMode: facingMode
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 12,
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'upc_reader',
            'upc_e_reader',
            'code_128_reader',
            'code_39_reader',
            'codabar_reader',
            'i2of5_reader'
          ]
        }
      },
      (err) => {
        if (err) {
          console.error('Quagga init error:', err)
          setError('Camera permission denied or camera not accessible.')
          return
        }
        Quagga.start()
      }
    )

    let lastCode = ''
    let count = 0

    Quagga.onDetected((data) => {
      if (data && data.codeResult && data.codeResult.code) {
        const code = data.codeResult.code.trim()
        if (code === lastCode) {
          count++
        } else {
          lastCode = code
          count = 1
        }
        if (count >= 2 || (data.codeResult.confidence && data.codeResult.confidence > 0.55)) {
          Quagga.stop()
          onDetected(code)
        }
      }
    })

    return () => {
      try {
        Quagga.stop()
      } catch (e) {}
    }
  }, [nativeDetectorUsed, facingMode, onDetected])

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
  }

  const scannerContent = (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Top Controls Bar inside Tab */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B52', display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FF6B52', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Camera Active
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={toggleCamera} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} title="Switch Camera">
            <RefreshCw size={13} /> Switch
          </button>
          {onClose && (
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
              <X size={15} /> Close
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div style={{ padding: '0.85rem', textAlign: 'center', color: '#ef4444' }}>
          <p style={{ fontWeight: 600, fontSize: '0.8rem' }}>{error}</p>
          {onClose && (
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ marginTop: '0.4rem' }}>
              Close Camera
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Fixed-Height Live Camera Viewport to Keep Tab Card Size Constant */}
          <div className="scanner-viewport" style={{ height: inline ? '185px' : '240px', position: 'relative', borderRadius: '14px', overflow: 'hidden', background: '#000', border: '2px solid rgba(255,107,82,0.4)' }}>
            {nativeDetectorUsed ? (
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted />
            ) : (
              <div ref={scannerRef} style={{ width: '100%', height: '100%' }} />
            )}

            {/* 4 Corner Target Brackets */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', width: '24px', height: '24px', borderTop: '3px solid #FF6B52', borderLeft: '3px solid #FF6B52', borderRadius: '4px 0 0 0', pointerEvents: 'none', zIndex: 12 }} />
            <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderTop: '3px solid #FF6B52', borderRight: '3px solid #FF6B52', borderRadius: '0 4px 0 0', pointerEvents: 'none', zIndex: 12 }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderBottom: '3px solid #FF6B52', borderLeft: '3px solid #FF6B52', borderRadius: '0 0 0 4px', pointerEvents: 'none', zIndex: 12 }} />
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderBottom: '3px solid #FF6B52', borderRight: '3px solid #FF6B52', borderRadius: '0 0 4px 0', pointerEvents: 'none', zIndex: 12 }} />

            {/* Dim Overlay */}
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 12px rgba(0,0,0,0.35)', pointerEvents: 'none', zIndex: 11 }} />

            {/* HORIZONTAL LASER BEAM MOVING UPWARD AND DOWNWARD */}
            <div className="scanner-line" />
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>
              Hold barcode steady inside the box
            </span>
          </div>
        </div>
      )}
    </div>
  )

  if (inline) {
    return scannerContent
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 300, background: 'rgba(35, 12, 63, 0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="modal" style={{ maxWidth: '480px', padding: '1.25rem', background: '#FFFFFF', borderRadius: '24px' }}>
        {scannerContent}
      </div>
    </div>
  )
}
