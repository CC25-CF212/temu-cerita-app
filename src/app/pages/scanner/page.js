"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  StopCircle,
  RotateCcw,
  Scan,
  Settings,
  Download,
  Upload,
} from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/library";
const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [currentDevice, setCurrentDevice] = useState("");
  const [devices, setDevices] = useState([]);
  const [scanMode, setScanMode] = useState("camera"); // 'camera', 'device', atau 'upload'
  const [error, setError] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Get available camera devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceList.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setCurrentDevice(videoDevices[0].deviceId);
        }
      } catch (err) {
        setError("Tidak bisa mengakses daftar kamera");
      }
    };
    getDevices();
  }, []);

  // Start camera scanning
  const startCameraScanning = async () => {
    try {
      setError("");
      const constraints = {
        video: {
          deviceId: currentDevice ? { exact: currentDevice } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);

        // Start barcode detection
        scanIntervalRef.current = setInterval(detectBarcode, 100);
      }
    } catch (err) {
      setError("Tidak bisa mengakses kamera: " + err.message);
    }
  };

  // Stop scanning
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    setIsScanning(false);
  };

  // Simple barcode detection with @zxing/library (placeholder implementation)
  const detectBarcode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Real implementation would use @zxing/library:
    /*
    import { BrowserMultiFormatReader } from '@zxing/library';
    const codeReader = new BrowserMultiFormatReader();
    
    try {
      const result = codeReader.decodeFromCanvas(canvas);
      if (result) {
        addScannedCode(result.getText(), 'Camera');
      }
    } catch (err) {
      // No barcode found
    }
    */

    // Mock detection untuk demo (replace dengan kode di atas)
    if (Math.random() < 0.01) {
      const mockBarcode = "DEMO" + Date.now().toString().slice(-6);
      addScannedCode(mockBarcode, "Camera");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const codeReader = new BrowserMultiFormatReader();
        const img = new Image();

        img.onload = async () => {
          try {
            // For older versions, use decode method with image element
            const result = await codeReader.decode(img);
            addScannedCode(result.getText(), "Upload Image");
          } catch (err) {
            // Alternative: Create canvas and use decodeFromCanvas if available
            try {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);

              // Check if method exists before calling
              if (typeof codeReader.decodeFromCanvas === "function") {
                const result = await codeReader.decodeFromCanvas(canvas);
                addScannedCode(result.getText(), "Upload Image");
              } else if (typeof codeReader.decode === "function") {
                const result = await codeReader.decode(canvas);
                addScannedCode(result.getText(), "Upload Image");
              } else {
                throw new Error("Tidak ada method decode yang tersedia");
              }
            } catch (canvasErr) {
              setError("Tidak ditemukan barcode dalam gambar: " + err.message);
            }
          }
        };

        img.onerror = () => {
          setError("Gagal memuat gambar");
        };

        img.src = event.target.result;
      } catch (error) {
        setError("Gagal memproses gambar: " + error.message);
      }
    };

    reader.onerror = () => {
      setError("Gagal membaca file");
    };

    reader.readAsDataURL(file);
  };
  // Generate sample barcode image
  const generateSampleBarcode = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 100;

    // Simple barcode pattern (black/white bars)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    const bars = [
      3, 2, 1, 1, 3, 1, 2, 2, 1, 2, 3, 1, 1, 2, 2, 3, 1, 1, 1, 3, 2, 1, 3, 2, 1,
      1, 2, 2, 3, 1,
    ];
    let x = 20;

    bars.forEach((width, i) => {
      if (i % 2 === 0) {
        ctx.fillRect(x, 20, width * 3, 60);
      }
      x += width * 3;
    });

    // Add text
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("123456789012", canvas.width / 2, 95);

    return canvas.toDataURL();
  };
  const handleDeviceInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      addScannedCode(e.target.value.trim(), "External Device");
      e.target.value = "";
    }
  };

  // Add scanned code to list
  const addScannedCode = (code, source) => {
    const newScan = {
      id: Date.now(),
      code: code,
      source: source,
      timestamp: new Date().toLocaleTimeString("id-ID"),
    };
    setScannedCodes((prev) => [newScan, ...prev].slice(0, 50)); // Keep last 50 scans
  };

  // Clear scanned codes
  const clearScannedCodes = () => {
    setScannedCodes([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Scan className="w-8 h-8 text-blue-600" />
          Barcode Scanner
        </h1>
        <p className="text-gray-600">
          Scan barcode dengan kamera laptop atau input dari alat scanner
          external
        </p>
      </div>

      {/* Mode Selection */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4 items-center mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Mode Scanner:</span>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="scanMode"
              value="camera"
              checked={scanMode === "camera"}
              onChange={(e) => setScanMode(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <Camera className="w-4 h-4" />
            <span>Kamera Laptop</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="scanMode"
              value="device"
              checked={scanMode === "device"}
              onChange={(e) => setScanMode(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <Scan className="w-4 h-4" />
            <span>Scanner External</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="scanMode"
              value="upload"
              checked={scanMode === "upload"}
              onChange={(e) => setScanMode(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <Upload className="w-4 h-4" />
            <span>Upload Gambar</span>
          </label>
        </div>
      </div>

      {/* Camera Mode */}
      {scanMode === "camera" && (
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Kontrol Kamera</h3>
              <div className="flex gap-2">
                {!isScanning ? (
                  <button
                    onClick={startCameraScanning}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Mulai Scan
                  </button>
                ) : (
                  <button
                    onClick={stopScanning}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <StopCircle className="w-4 h-4" />
                    Stop Scan
                  </button>
                )}
              </div>
            </div>

            {/* Camera Selection */}
            {devices.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Kamera:
                </label>
                <select
                  value={currentDevice}
                  onChange={(e) => setCurrentDevice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isScanning}
                >
                  {devices.map((device, index) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Kamera ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Video Preview */}
          <div
            className="relative bg-black rounded-lg overflow-hidden mb-4"
            style={{ aspectRatio: "16/9" }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Klik "Mulai Scan" untuk mengaktifkan kamera</p>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-64 h-40 border-2 border-red-500 border-dashed rounded-lg animate-pulse"></div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Scanning...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Image Mode */}
      {scanMode === "upload" && (
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">
              Upload Gambar Barcode
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload gambar yang berisi barcode/QR code untuk di-scan
            </p>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />

              {uploadedImage && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded barcode"
                    className="max-w-full h-auto mx-auto max-h-64 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sample Barcodes */}
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">
              Contoh Gambar Barcode untuk Testing:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample Code128 */}
              <div className="bg-white p-3 rounded border text-center">
                <div className="mb-2">
                  <svg width="200" height="60" className="mx-auto">
                    <rect width="200" height="60" fill="white" />
                    {/* Simple barcode pattern */}
                    <rect x="10" y="10" width="2" height="30" fill="black" />
                    <rect x="14" y="10" width="1" height="30" fill="black" />
                    <rect x="17" y="10" width="3" height="30" fill="black" />
                    <rect x="22" y="10" width="1" height="30" fill="black" />
                    <rect x="25" y="10" width="2" height="30" fill="black" />
                    <rect x="29" y="10" width="2" height="30" fill="black" />
                    <rect x="33" y="10" width="1" height="30" fill="black" />
                    <rect x="36" y="10" width="2" height="30" fill="black" />
                    <rect x="40" y="10" width="3" height="30" fill="black" />
                    <rect x="45" y="10" width="1" height="30" fill="black" />
                    <rect x="48" y="10" width="1" height="30" fill="black" />
                    <rect x="51" y="10" width="2" height="30" fill="black" />
                    <rect x="55" y="10" width="2" height="30" fill="black" />
                    <rect x="59" y="10" width="3" height="30" fill="black" />
                    <rect x="64" y="10" width="1" height="30" fill="black" />
                    <rect x="67" y="10" width="1" height="30" fill="black" />
                    <rect x="70" y="10" width="1" height="30" fill="black" />
                    <rect x="73" y="10" width="3" height="30" fill="black" />
                    <rect x="78" y="10" width="2" height="30" fill="black" />
                    <rect x="82" y="10" width="1" height="30" fill="black" />
                    <rect x="85" y="10" width="3" height="30" fill="black" />
                    <rect x="90" y="10" width="2" height="30" fill="black" />
                    <rect x="94" y="10" width="1" height="30" fill="black" />
                    <rect x="97" y="10" width="1" height="30" fill="black" />
                    <rect x="100" y="10" width="2" height="30" fill="black" />
                    <rect x="104" y="10" width="2" height="30" fill="black" />
                    <rect x="108" y="10" width="3" height="30" fill="black" />
                    <rect x="113" y="10" width="1" height="30" fill="black" />
                    <text
                      x="100"
                      y="55"
                      textAnchor="middle"
                      fontSize="10"
                      fill="black"
                    >
                      123456789012
                    </text>
                  </svg>
                </div>
                <p className="text-xs text-gray-600">
                  Code128 - Barcode Linear
                </p>
              </div>

              {/* Sample QR Code */}
              <div className="bg-white p-3 rounded border text-center">
                <div className="mb-2">
                  <svg width="100" height="100" className="mx-auto">
                    <rect width="100" height="100" fill="white" />
                    {/* Simple QR pattern */}
                    <rect x="10" y="10" width="30" height="30" fill="black" />
                    <rect x="15" y="15" width="20" height="20" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="black" />

                    <rect x="60" y="10" width="30" height="30" fill="black" />
                    <rect x="65" y="15" width="20" height="20" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="black" />

                    <rect x="10" y="60" width="30" height="30" fill="black" />
                    <rect x="15" y="65" width="20" height="20" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="black" />

                    {/* Data pattern */}
                    <rect x="45" y="45" width="5" height="5" fill="black" />
                    <rect x="55" y="45" width="5" height="5" fill="black" />
                    <rect x="45" y="55" width="5" height="5" fill="black" />
                    <rect x="65" y="55" width="5" height="5" fill="black" />
                    <rect x="75" y="65" width="5" height="5" fill="black" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">QR Code - 2D Matrix</p>
              </div>
            </div>

            <div className="mt-3 text-sm text-blue-700">
              <p>
                <strong>Jenis barcode yang didukung:</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>• Code128, Code39</div>
                <div>• EAN-13, EAN-8</div>
                <div>• UPC-A, UPC-E</div>
                <div>• QR Code</div>
                <div>• Data Matrix</div>
                <div>• PDF417</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Mode */}
      {scanMode === "device" && (
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">
              Input dari Alat Scanner
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Gunakan scanner barcode external, lalu tekan Enter setelah scan
            </p>
            <input
              type="text"
              placeholder="Hasil scan akan muncul di sini... (tekan Enter)"
              onKeyPress={handleDeviceInput}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Scanned Results */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700">
            Hasil Scan ({scannedCodes.length})
          </h3>
          {scannedCodes.length > 0 && (
            <button
              onClick={clearScannedCodes}
              className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {scannedCodes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada barcode yang di-scan
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {scannedCodes.map((scan) => (
              <div
                key={scan.id}
                className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-mono text-lg font-medium text-gray-800">
                    {scan.code}
                  </div>
                  <div className="text-sm text-gray-500">
                    {scan.source} • {scan.timestamp}
                  </div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(scan.code)}
                  className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">
          Cara Penggunaan & Library:
        </h4>
        <div className="text-blue-700 text-sm space-y-2">
          <div>
            <strong>Mode Kamera:</strong> Gunakan kamera laptop untuk scan
            barcode secara real-time
          </div>
          <div>
            <strong>Mode Upload:</strong> Upload gambar (.jpg, .png, .gif) yang
            berisi barcode/QR code
          </div>
          <div>
            <strong>Mode External:</strong> Sambungkan scanner barcode external
            dan scan langsung ke input field
          </div>
          <div className="mt-3 p-3 bg-white rounded border">
            <strong>Untuk Production, install library:</strong>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              {`# ZXing Library (Recommended - Support semua format)
npm install @zxing/library

# atau QuaggaJS (Khusus 1D barcode)
npm install quagga

# atau React wrapper
npm install react-qr-barcode-scanner`}
            </pre>
          </div>
          <div className="mt-2">
            <strong>Format yang didukung:</strong> Code128, Code39, EAN-13/8,
            UPC-A/E, QR Code, Data Matrix, PDF417
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
