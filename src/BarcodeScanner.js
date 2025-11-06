import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const [result, setResult] = useState("");
  const readerRef = useRef(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    return () => {
      // Cleanup quando il componente viene smontato
      stop();
    };
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Usa decodeFromVideoDevice correttamente
        readerRef.current.decodeFromVideoDevice(
          undefined, // deviceId (undefined = default)
          videoRef.current,
          (res, err) => {
            if (res) {
              setResult(res.getText());
            }
            if (err && !(err.name === "NotFoundException")) {
              console.error(err);
            }
          }
        );
      }
    } catch (e) {
      alert("Impossibile accedere alla fotocamera: " + e.message);
      console.error(e);
    }
  };

  const stop = () => {
    // Ferma lo stream video
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Pulisci il video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Resetta il reader (se esiste il metodo)
    if (readerRef.current) {
      try {
        readerRef.current.stopContinuousDecode?.();
      } catch (e) {
        console.warn("Errore durante lo stop del reader:", e);
      }
    }
  };

  return (
    <div
      style={{ display: "grid", gap: 12, maxWidth: 520, margin: "40px auto" }}
    >
      <h2>Scanner Barcode</h2>
      <video
        ref={videoRef}
        style={{ width: "100%", borderRadius: 8 }}
        muted
        playsInline
      />
      <div>
        <button onClick={start}>Avvia scanner</button>
        <button onClick={stop} style={{ marginLeft: 8 }}>
          Stop
        </button>
      </div>
      <div>
        <strong>Risultato:</strong> {result || "—"}
      </div>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Suggerimento: punta la camera posteriore su un EAN/QR. Funziona in HTTPS
        (GitHub Pages è OK).
      </p>
    </div>
  );
}
