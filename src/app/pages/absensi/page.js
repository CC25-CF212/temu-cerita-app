"use client"; // THIS IS THE CRUCIAL LINE. It must be the very first line.

import dynamic from "next/dynamic";

// Dynamically import YOUR main AttendanceSystem component
// Adjust the path if your AttendanceSystem.jsx is located elsewhere
const AttendanceSystem = dynamic(
  () => import("@/components/AttendanceSystem"),
  {
    ssr: false, // This is now allowed because this whole file is a Client Component
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-blue-700">
            Memuat Sistem Absensi...
          </p>
        </div>
      </div>
    ),
  }
);

// This component just renders the dynamically loaded AttendanceSystem
export default function AttendanceLoader() {
  return <AttendanceSystem />;
}

// "use client"; // THIS IS THE CRUCIAL LINE. It must be the very first line.

// import dynamic from "next/dynamic";

// // Dynamically import YOUR main AttendanceSystem component
// // Adjust the path if your AttendanceSystem.jsx is located elsewhere
// const AttendanceSystem = dynamic(
//   () => import("@/components/AttendanceSystem"),
//   {
//     ssr: false, // This is now allowed because this whole file is a Client Component
//     loading: () => (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-lg font-semibold text-blue-700">
//             Memuat Sistem Absensi...
//           </p>
//         </div>
//       </div>
//     ),
//   }
// );

// // This component just renders the dynamically loaded AttendanceSystem
// export default function AttendanceLoader() {
//   return <AttendanceSystem />;
// }
// ParentComponent.jsx - Complete Camera Implementation
// "use client";
// import CameraComponent from "@/components/CameraComponent";
// import React, { useState, useRef, useCallback } from "react";
// const ParentComponent = () => {
//   const cameraRef = useRef(null);

//   // States untuk tracking camera status
//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [facesDetected, setFacesDetected] = useState(0);
//   const [cameraError, setCameraError] = useState(null);
//   const [lastDetections, setLastDetections] = useState([]);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [isCapturing, setIsCapturing] = useState(false);

//   // Camera ready callback
//   const handleCameraReady = useCallback(
//     (ready) => {
//       console.log("[PARENT] Camera ready state:", ready);
//       setIsCameraReady(ready);

//       // Clear error jika camera sudah ready
//       if (ready && cameraError) {
//         setCameraError(null);
//       }
//     },
//     [cameraError]
//   );

//   // Face detection callback
//   const handleFaceDetected = useCallback((count, detected, detections) => {
//     console.log("[PARENT] Face detection:", {
//       count,
//       detected,
//       detections: detections?.length,
//     });

//     setFacesDetected(count);
//     setLastDetections(detections || []);

//     // Optional: Auto-capture when face detected
//     // if (count > 0 && !capturedImage) {
//     //   handleCaptureImage();
//     // }
//   }, []);

//   // Camera error callback
//   const handleCameraError = useCallback((errorMsg) => {
//     console.error("[PARENT] Camera error:", errorMsg);
//     setCameraError(errorMsg);
//     setIsCameraReady(false);

//     // Optional: Show toast notification
//     // toast.error(errorMsg);
//   }, []);

//   // Capture image function
//   const handleCaptureImage = useCallback(async () => {
//     if (!cameraRef.current || !isCameraReady) {
//       console.warn("[PARENT] Cannot capture: camera not ready");
//       return null;
//     }

//     setIsCapturing(true);

//     try {
//       const imageData = cameraRef.current.captureImage();

//       if (imageData) {
//         setCapturedImage(imageData);
//         console.log("[PARENT] Image captured successfully");

//         // Optional: Upload to server
//         // await uploadImageToServer(imageData);

//         return imageData;
//       } else {
//         console.warn("[PARENT] Failed to capture image");
//         setCameraError("Gagal mengambil gambar. Pastikan kamera aktif.");
//         return null;
//       }
//     } catch (error) {
//       console.error("[PARENT] Capture error:", error);
//       setCameraError("Terjadi kesalahan saat mengambil gambar.");
//       return null;
//     } finally {
//       setIsCapturing(false);
//     }
//   }, [isCameraReady]);

//   // Restart detection function
//   const handleRestartDetection = useCallback(() => {
//     if (!cameraRef.current) {
//       console.warn("[PARENT] Cannot restart: camera ref not available");
//       return;
//     }

//     console.log("[PARENT] Restarting face detection...");
//     cameraRef.current.restartDetection();
//   }, []);

//   // Check if models are loaded
//   const checkModelsStatus = useCallback(() => {
//     if (!cameraRef.current) return false;
//     return cameraRef.current.areModelsLoaded();
//   }, []);

//   // Clear captured image
//   const handleClearImage = useCallback(() => {
//     setCapturedImage(null);
//   }, []);

//   // Reset all states
//   const handleReset = useCallback(() => {
//     setCapturedImage(null);
//     setCameraError(null);
//     setFacesDetected(0);
//     setLastDetections([]);
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Face Detection Camera
//         </h1>
//         <p className="text-gray-600">
//           Sistem deteksi wajah real-time dengan AI
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Camera Section */}
//         <div className="space-y-4">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Live Camera Feed
//             </h2>

//             <CameraComponent
//               ref={cameraRef}
//               onReady={handleCameraReady}
//               onFaceDetected={handleFaceDetected}
//               onError={handleCameraError}
//             />
//           </div>

//           {/* Camera Controls */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               Controls
//             </h3>

//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={handleCaptureImage}
//                 disabled={!isCameraReady || isCapturing}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                   isCameraReady && !isCapturing
//                     ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 {isCapturing ? (
//                   <>
//                     <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
//                     Capturing...
//                   </>
//                 ) : (
//                   "📸 Capture Image"
//                 )}
//               </button>

//               <button
//                 onClick={handleRestartDetection}
//                 disabled={!isCameraReady}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                   isCameraReady
//                     ? "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 🔄 Restart Detection
//               </button>

//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
//               >
//                 🧹 Reset All
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Status & Results Section */}
//         <div className="space-y-4">
//           {/* Status Panel */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               System Status
//             </h3>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Camera Status:</span>
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     isCameraReady
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {isCameraReady ? "✅ Ready" : "❌ Not Ready"}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">AI Models:</span>
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     checkModelsStatus()
//                       ? "bg-blue-100 text-blue-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {checkModelsStatus() ? "🤖 Loaded" : "❌ Failed"}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Faces Detected:</span>
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     facesDetected > 0
//                       ? "bg-purple-100 text-purple-800"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   👤 {facesDetected}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Error Display */}
//           {cameraError && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <span className="text-red-500 text-xl">⚠️</span>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">
//                     Camera Error
//                   </h3>
//                   <p className="text-sm text-red-700 mt-1">{cameraError}</p>
//                   <button
//                     onClick={() => setCameraError(null)}
//                     className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
//                   >
//                     Dismiss
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Face Detection Details */}
//           {facesDetected > 0 && lastDetections.length > 0 && (
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-blue-800 mb-3">
//                 Detection Details
//               </h3>

//               <div className="space-y-2">
//                 {lastDetections.map((detection, index) => (
//                   <div key={index} className="bg-white p-3 rounded border">
//                     <div className="text-sm text-gray-600">
//                       <strong>Face {index + 1}:</strong>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       Confidence: {(detection.detection.score * 100).toFixed(1)}
//                       %
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Position: {Math.round(detection.detection.box.x)},{" "}
//                       {Math.round(detection.detection.box.y)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Size: {Math.round(detection.detection.box.width)} ×{" "}
//                       {Math.round(detection.detection.box.height)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Captured Image Display */}
//           {capturedImage && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Captured Image
//                 </h3>
//                 <button
//                   onClick={handleClearImage}
//                   className="text-red-500 hover:text-red-700 text-sm font-medium"
//                 >
//                   🗑️ Clear
//                 </button>
//               </div>

//               <div className="bg-white p-2 rounded border">
//                 <img
//                   src={capturedImage}
//                   alt="Captured"
//                   className="w-full h-auto rounded"
//                 />
//                 <div className="mt-2 flex gap-2">
//                   <a
//                     href={capturedImage}
//                     download={`face-capture-${Date.now()}.jpg`}
//                     className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors"
//                   >
//                     💾 Download
//                   </a>
//                   <button
//                     onClick={() => navigator.clipboard.writeText(capturedImage)}
//                     className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
//                   >
//                     📋 Copy Link
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Debug Info (Development Only) */}
//       {process.env.NODE_ENV === "development" && (
//         <div className="mt-8 bg-gray-100 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">
//             Debug Information
//           </h3>
//           <pre className="text-xs text-gray-600 bg-white p-3 rounded overflow-auto">
//             {JSON.stringify(
//               {
//                 isCameraReady,
//                 facesDetected,
//                 cameraError,
//                 modelsLoaded: checkModelsStatus(),
//                 capturedImage: !!capturedImage,
//                 detectionsCount: lastDetections.length,
//               },
//               null,
//               2
//             )}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ParentComponent;
