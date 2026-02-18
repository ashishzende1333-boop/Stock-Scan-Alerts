import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Camera, RefreshCw } from "lucide-react";

interface ScannerProps {
  onScan: (decodedText: string) => void;
  isScanning: boolean;
  onClose: () => void;
}

export function Scanner({ onScan, isScanning, onClose }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isScanning) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      return;
    }

    // Small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
            ],
            showTorchButtonIfSupported: true,
          },
          false
        );

        scanner.render(
          (decodedText) => {
            onScan(decodedText);
            // Optionally clear on success if you want single scan mode
            // scanner.clear(); 
          },
          (errorMessage) => {
            // Ignore scan errors, they happen constantly while scanning
          }
        );

        scannerRef.current = scanner;
      } catch (err) {
        console.error("Scanner init error:", err);
        setError("Could not initialize camera. Please check permissions.");
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isScanning, onScan]);

  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
        >
          <div className="w-full max-w-md bg-card rounded-xl overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b flex justify-between items-center bg-background">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-lg">Scan Barcode</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4 bg-black">
              {error ? (
                <div className="text-destructive text-center py-8">
                  <p>{error}</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Reload
                  </Button>
                </div>
              ) : (
                <div id="reader" className="w-full aspect-square bg-black overflow-hidden rounded-lg"></div>
              )}
            </div>

            <div className="p-4 text-center text-sm text-muted-foreground bg-background">
              Point camera at a barcode to scan automatically.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
