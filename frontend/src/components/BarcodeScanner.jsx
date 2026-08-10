import { useEffect, useRef, useState } from 'react'
import Quagga from 'quagga'
import { Camera, X, RefreshCw, Sparkles, CheckCircle2, Search } from 'lucide-react'

export default function BarcodeScanner({ onDetected, onClose }) {
  const scannerRef = useRef(null)
  const videoRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [manualCode, setManualCode] = useState('')
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

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualCode.trim()) {
      onDetected(manualCode.trim())
    }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 300, background: 'rgba(35, 12, 63, 0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="modal" style={{ maxWidth: '520px', padding: '1.5rem', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 30px 80px rgba(53,19,95,0.3)' }}>
        
        {/* Scanner Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: '#35135F', fontWeight: 900 }}>
              <Camera size={22} color="#FF6B52" /> Real-World Barcode Scanner
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF6B52', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Scanning Barcode Live...
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={toggleCamera} className="btn btn-secondary btn-sm" title="Switch Camera">
              <RefreshCw size={16} />
            </button>
            <button onClick={onClose} className="btn btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        {error ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#ef4444' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Close Scanner
            </button>
          </div>
        ) : (
          <div>
            {/* Live Camera Viewport with Animated Laser Sweeper & Target Corners */}
            <div className="scanner-viewport" style={{ height: '320px', position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#000', border: '2px solid rgba(255,107,82,0.3)' }}>
              {nativeDetectorUsed ? (
                <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted />
              ) : (
                <div ref={scannerRef} style={{ width: '100%', height: '100%' }} />
              )}

              {/* 4 Corner Target Brackets */}
              <div style={{ position: 'absolute', top: '24px', left: '24px', width: '32px', height: '32px', borderTop: '4px solid #FF6B52', borderLeft: '4px solid #FF6B52', borderRadius: '6px 0 0 0', pointerEvents: 'none', zIndex: 12 }} />
              <div style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', borderTop: '4px solid #FF6B52', borderRight: '4px solid #FF6B52', borderRadius: '0 6px 0 0', pointerEvents: 'none', zIndex: 12 }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '32px', height: '32px', borderBottom: '4px solid #FF6B52', borderLeft: '4px solid #FF6B52', borderRadius: '0 0 0 6px', pointerEvents: 'none', zIndex: 12 }} />
              <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '32px', height: '32px', borderBottom: '4px solid #FF6B52', borderRight: '4px solid #FF6B52', borderRadius: '0 0 6px 0', pointerEvents: 'none', zIndex: 12 }} />

              {/* Outer Dim Overlay */}
              <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 20px rgba(0,0,0,0.5)', pointerEvents: 'none', zIndex: 11 }} />

              {/* Animated Laser Beam Sweeper */}
              <div className="scanner-line" />
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.85rem', marginBottom: '1rem' }}>
              <span className="badge badge-green" style={{ background: 'rgba(255,107,82,0.15)', color: '#FF6B52', padding: '0.3rem 0.85rem' }}>
                <Sparkles size={13} /> Align any product barcode inside frame
              </span>
            </div>

            {/* Quick Manual Entry Backup */}
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(53,19,95,0.1)' }}>
              <input
                type="text"
                placeholder="Or type barcode e.g. 8901058000185"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="input"
                style={{ fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap', borderRadius: '12px' }}>
                <Search size={16} /> Lookup
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
