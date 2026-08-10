import { useEffect, useRef, useState } from 'react'
import Quagga from 'quagga'
import { Camera, X, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react'

export default function BarcodeScanner({ onDetected, onClose }) {
  const scannerRef = useRef(null)
  const videoRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [scanning, setScanning] = useState(true)
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
          }, 200)
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
        frequency: 10,
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
          setScanning(false)
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
        // Verify detection confidence across consecutive frames
        if (count >= 2 || (data.codeResult.confidence && data.codeResult.confidence > 0.6)) {
          Quagga.stop()
          setScanning(false)
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

  return (
    <div className="modal-overlay" style={{ zIndex: 300 }}>
      <div className="modal" style={{ maxWidth: '520px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', color: '#35135F', fontWeight: 800 }}>
            <Camera size={22} color="#FF6B52" /> Real-World Barcode Scanner
          </h3>
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
            <div className="scanner-viewport" style={{ height: '310px', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
              {nativeDetectorUsed ? (
                <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted />
              ) : (
                <div ref={scannerRef} style={{ width: '100%', height: '100%' }} />
              )}

              {/* Target Scan Frame */}
              <div
                style={{
                  position: 'absolute',
                  inset: '20px',
                  border: '2px dashed #FF6B52',
                  borderRadius: '16px',
                  boxShadow: '0 0 0 1000px rgba(0,0,0,0.4)',
                  pointerEvents: 'none'
                }}
              />
              <div className="scanner-line" style={{ background: '#FF6B52', boxShadow: '0 0 12px #FF6B52' }} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span className="badge badge-green" style={{ background: 'rgba(255,107,82,0.15)', color: '#FF6B52' }}>
                <Sparkles size={12} /> {nativeDetectorUsed ? 'Hardware Barcode Detector Active' : 'Quagga Scan Engine Active'}
              </span>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                Hold camera steady over any product barcode (EAN-13, UPC, EAN-8)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
