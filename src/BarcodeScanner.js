import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const [result, setResult] = useState("");
  const [reader] = useState(() => new BrowserMultiFormatReader());

  useEffect(() => {
    return () => reader.reset(); // cleanup
  }, [reader]);

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
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      reader.decodeFromVideoDevice(null, videoRef.current, (res) => {
        if (res) setResult(res.getText());
      });
    } catch (e) {
      alert("Impossibile accedere alla fotocamera: " + e.message);
      console.error(e);
    }
  };

  const stop = () => {
    reader.reset();
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
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
