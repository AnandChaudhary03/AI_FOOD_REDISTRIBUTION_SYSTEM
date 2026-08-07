import { useEffect, useRef, useState } from 'react'
import Quagga from 'quagga'
import { Camera, X, RefreshCw } from 'lucide-react'

export default function BarcodeScanner({ onDetected, onClose }) {
  const scannerRef = useRef(null)
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!scannerRef.current) return

    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment'
          }
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'upc_reader']
        }
      },
      (err) => {
        if (err) {
          console.error(err)
          setError('Camera permission denied or camera not found.')
          setScanning(false)
          return
        }
        Quagga.start()
      }
    )

    Quagga.onDetected((data) => {
      if (data && data.codeResult) {
        const code = data.codeResult.code
        Quagga.stop()
        setScanning(false)
        onDetected(code)
      }
    })

    return () => {
      try {
        Quagga.stop()
      } catch (e) {}
    }
  }, [onDetected])

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--accent-green)" /> Scan Barcode
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        {error ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--accent-red)' }}>
            <p>{error}</p>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="scanner-viewport" ref={scannerRef} style={{ height: '300px' }}>
              <div className="scanner-overlay" />
              <div className="scanner-line" />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Align barcode inside the box
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
