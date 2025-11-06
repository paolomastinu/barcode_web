import "./App.css";
import BarcodeScanner from "./BarcodeScanner";

function App() {
  return (
    <div className="App">
      <div>
        <h1 style={{ textAlign: "center" }}>Demo CRA + Scanner</h1>
        <BarcodeScanner />
      </div>
    </div>
  );
}

export default App;
