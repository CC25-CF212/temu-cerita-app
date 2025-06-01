import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Calendar,
  Wifi,
  UserPlus,
  Users,
  AlertTriangle,
  LocateFixed,
  Building,
} from "lucide-react";
import CameraComponent from "./CameraComponent";
import {
  AVAILABLE_OFFICE_LOCATIONS,
  OFFICE_LOCATION_RADIUS,
  WORK_SCHEDULE,
} from "@/config/attendanceConfig";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  calculateDistance,
  formatDate,
  formatTime,
  validateTime,
} from "@/utils/attendanceUtils";

const AttendanceSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOffice, setSelectedOffice] = useState(
    AVAILABLE_OFFICE_LOCATIONS[0]
  );
  const [attendanceType, setAttendanceType] = useState("masuk");
  const [employee, setEmployee] = useState({
    id: "",
    name: "",
    department: "",
  });
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState("attendance");
  const [registeredFaces, setRegisteredFaces] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const { location: currentLocation, loading: isLocationLoading } =
    useGeolocation();
  const [isUserWithinRange, setIsUserWithinRange] = useState(false);
  const [locationDisplayStatus, setLocationDisplayStatus] = useState("loading");

  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const [cameraError, setCameraError] = useState(null);
  const [lastDetections, setLastDetections] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const handleOfficeChange = (event) => {
    const officeId = event.target.value;
    const office = AVAILABLE_OFFICE_LOCATIONS.find(
      (loc) => loc.id === officeId
    );
    if (office) setSelectedOffice(office);
  };

  const handleCameraReady = useCallback(
    (ready) => {
      console.log("[PARENT] Camera ready state:", ready);
      setIsCameraReady(ready);

      // Clear error jika camera sudah ready
      if (ready && cameraError) {
        setCameraError(null);
      }
    },
    [cameraError]
  );
  // Capture image function
  const handleCaptureImage = useCallback(async () => {
    if (!cameraRef.current || !isCameraReady) {
      console.warn("[PARENT] Cannot capture: camera not ready");
      return null;
    }

    setIsCapturing(true);

    try {
      const imageData = cameraRef.current.captureImage();

      if (imageData) {
        setCapturedImage(imageData);
        console.log("[PARENT] Image captured successfully");

        // Optional: Upload to server
        // await uploadImageToServer(imageData);

        return imageData;
      } else {
        console.warn("[PARENT] Failed to capture image");
        setCameraError("Gagal mengambil gambar. Pastikan kamera aktif.");
        return null;
      }
    } catch (error) {
      console.error("[PARENT] Capture error:", error);
      setCameraError("Terjadi kesalahan saat mengambil gambar.");
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isCameraReady]);

  const handleFaceDetected = useCallback((count, detected, detections) => {
    console.log("[PARENT] Face detection:", {
      count,
      detected,
      detections: detections?.length,
    });

    setFacesDetected(count);
    setLastDetections(detections || []);

    // Optional: Auto-capture when face detected
    // if (count > 0 && !capturedImage) {
    //   handleCaptureImage();
    // }
  }, []);

  // Camera error callback
  const handleCameraError = useCallback((errorMsg) => {
    console.error("[PARENT] Camera error:", errorMsg);
    setCameraError(errorMsg);
    setIsCameraReady(false);

    // Optional: Show toast notification
    // toast.error(errorMsg);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLocationLoading) {
      setLocationDisplayStatus("loading");
      setIsUserWithinRange(false);
      return;
    }

    if (currentLocation.error) {
      setLocationDisplayStatus("error");
      setIsUserWithinRange(false);
      return;
    }

    if (selectedOffice.id === "remote_default") {
      setLocationDisplayStatus("remote_selected");
      setIsUserWithinRange(true);
      return;
    }

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      selectedOffice.latitude,
      selectedOffice.longitude
    );
    const inRange = distance <= OFFICE_LOCATION_RADIUS;
    setIsUserWithinRange(inRange);
    setLocationDisplayStatus(inRange ? "success" : "out_of_range");
  }, [currentLocation, selectedOffice, isLocationLoading]);

  const currentValidateTimeStatus = validateTime(
    currentTime,
    attendanceType,
    WORK_SCHEDULE
  );
  const registerFace = async () => {
    setIsRegistering(true);
    if (!employee.id || !employee.name || !employee.department) {
      alert("Mohon lengkapi semua data karyawan (ID, Nama, Departemen).");
      setIsRegistering(false);
      return;
    }
    if (!isCameraReady || facesDetected === 0) {
      alert(
        "Wajah tidak terdeteksi atau kamera bermasalah. Pastikan wajah Anda terlihat jelas."
      );
      setIsRegistering(false);
      return;
    }
    if (cameraRef.current && !cameraRef.current.areModelsLoaded()) {
      alert(
        "Model AI belum siap. Pendaftaran wajah tidak dapat dilakukan dengan akurat saat ini."
      );
      setIsRegistering(false);
      return;
    }

    const faceImage = cameraRef.current?.captureImage();
    if (!faceImage) {
      alert("Gagal mengambil gambar wajah. Pastikan kamera aktif.");
      setIsRegistering(false);
      return;
    }
    if (registeredFaces.find((face) => face.employeeId === employee.id)) {
      alert("Karyawan dengan ID ini sudah terdaftar.");
      setIsRegistering(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newFace = {
      employeeId: employee.id,
      name: employee.name,
      department: employee.department,
      faceImage: faceImage,
      registeredAt: new Date().toISOString(),
      faceFeatures: Array.from({ length: 128 }, () => Math.random()),
    };
    saveFacesToStorage([...registeredFaces, newFace]);
    setAttendanceStatus({
      success: true,
      message: "Wajah berhasil didaftarkan!",
      status: "registered",
      time: currentTime?.toLocaleTimeString("id-ID") || "N/A",
    });
    setIsRegistering(false);
    setTimeout(() => {
      setAttendanceStatus(null);
      setEmployee({ id: "", name: "", department: "" });
      setMode("attendance");
    }, 3000);
  };
  const saveFacesToStorage = (faces) => {
    setRegisteredFaces(faces);
  };
  const processAttendance = async () => {
    setIsProcessing(true);
    if (!employee.id) {
      alert("Mohon masukkan ID karyawan.");
      setIsProcessing(false);
      return;
    }
    if (!isCameraReady || facesDetected === 0) {
      alert(
        "Wajah tidak terdeteksi atau kamera bermasalah. Pastikan wajah Anda terlihat jelas."
      );
      setIsProcessing(false);
      return;
    }
    if (cameraRef.current && !cameraRef.current.areModelsLoaded()) {
      alert(
        "Model AI belum siap. Absensi dengan verifikasi wajah penuh tidak dapat dilakukan saat ini."
      );
      setIsProcessing(false);
      return;
    }

    const faceImageForAttendance = cameraRef.current?.captureImage();
    if (!faceImageForAttendance) {
      alert("Gagal mengambil gambar wajah untuk absensi.");
      setIsProcessing(false);
      return;
    }

    try {
      const recognition = await recognizeFaceSimulated(faceImageForAttendance);
      if (!recognition.recognized) {
        alert(
          `Wajah tidak dikenali atau ID tidak cocok (akurasi: ${recognition.confidence.toFixed(
            1
          )}%). Pastikan ID Karyawan benar & terdaftar.`
        );
        setIsProcessing(false);
        return;
      }

      const recognizedEmployeeData = registeredFaces.find(
        (f) => f.employeeId === recognition.employeeId
      );
      if (recognizedEmployeeData) {
        setEmployee((prev) => ({
          ...prev,
          name: recognizedEmployeeData.name,
          department: recognizedEmployeeData.department,
        }));
      }

      const timeValidation = validateTime();
      if (!timeValidation.valid) {
        const schedule = WORK_SCHEDULE[attendanceType];
        let message = `Di luar jam absen (${timeValidation.status.replace(
          /_/g,
          " "
        )}). `;
        if (schedule) {
          message +=
            attendanceType === "masuk"
              ? `Jam masuk: ${schedule.start} - ${schedule.end} (+${
                  schedule.grace || 0
                } menit toleransi).`
              : `Jam pulang: ${schedule.start} - ${schedule.end}.`;
        }
        alert(message);
        setIsProcessing(false);
        return;
      }

      if (selectedOffice.id !== "remote_default" && !isUserWithinRange) {
        alert(
          `Anda (${
            locationDisplayStatus === "out_of_range"
              ? "di luar jangkauan"
              : "lokasi error"
          }) radius ${OFFICE_LOCATION_RADIUS}m dari ${
            selectedOffice.name
          }. Absensi tidak dapat dilakukan.`
        );
        setIsProcessing(false);
        return;
      }
      if (
        selectedOffice.id !== "remote_default" &&
        locationDisplayStatus !== "success"
      ) {
        alert(
          `Status lokasi tidak valid (${locationDisplayStatus}) untuk absen di kantor fisik. Pastikan lokasi akurat dan dalam jangkauan.`
        );
        setIsProcessing(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
      const attendanceData = {
        employeeId: recognition.employeeId,
        employeeName: recognition.name,
        department: recognizedEmployeeData?.department || employee.department,
        type: attendanceType,
        timestamp: currentTime?.toISOString() || new Date().toISOString(),
        location: {
          ...currentLocation,
          selectedOfficeName: selectedOffice.name,
          isWithinRange: isUserWithinRange,
          locationStatus: locationDisplayStatus,
        },
        status: timeValidation.status,
        faceImage: faceImageForAttendance,
        recognitionConfidence: recognition.confidence,
      };
      console.log("Attendance Data:", attendanceData);

      setAttendanceStatus({
        success: true,
        message: `Absen ${attendanceType} (${timeValidation.status.replace(
          /_/g,
          " "
        )}) berhasil!`,
        status: timeValidation.status,
        time: currentTime?.toLocaleTimeString("id-ID") || "N/A",
        confidence: recognition.confidence,
        employeeName: recognition.name,
      });
      setIsProcessing(false);
      setTimeout(() => {
        setAttendanceStatus(null);
        setEmployee({ id: "", name: "", department: "" });
      }, 4000);
    } catch (error) {
      console.error("Attendance processing error:", error);
      alert("Terjadi kesalahan dalam proses absensi. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };
  const recognizeFaceSimulated = async (capturedImage) => {
    if (registeredFaces.length === 0) {
      return { recognized: false, employeeId: null, confidence: 0 };
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    const matchingFace = registeredFaces.find(
      (face) => face.employeeId === employee.id
    );
    if (matchingFace) {
      const baseConfidence = 88 + Math.random() * 8;
      const imageQualityFactor =
        capturedImage && capturedImage.length > 50000 ? 1 : 0.9;
      const finalConfidence = baseConfidence * imageQualityFactor;
      return {
        recognized: finalConfidence > 85,
        employeeId: matchingFace.employeeId,
        name: matchingFace.name,
        confidence: finalConfidence,
      };
    }
    return {
      recognized: false,
      employeeId: null,
      confidence: Math.random() * 30 + 45,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          {/* ... Konten Header ... */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Sistem Absensi Karyawan</h1>
            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="text-3xl font-bold mt-2 tracking-wider">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="p-4 border-b">
          {/* ... Konten Mode Toggle ... */}
          <div className="flex gap-2">
            {["attendance", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setAttendanceStatus(null);
                  setEmployee({ id: "", name: "", department: "" });
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  mode === m
                    ? m === "attendance"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {m === "attendance" ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
                {m === "attendance" ? "Absensi" : "Daftar Wajah"}
              </button>
            ))}
          </div>
        </div>

        {/* Office Location & Status */}
        <div className="p-5 border-b space-y-3">
          {/* ... Konten Lokasi ... */}
          <div>
            <label
              htmlFor="officeLocation"
              className="block text-sm font-medium text-gray-700 mb-1 items-center"
            >
              <Building className="w-4 h-4 mr-2 text-gray-500" />
              Pilih Lokasi Kantor:
            </label>
            <select
              id="officeLocation"
              value={selectedOffice.id}
              onChange={handleOfficeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {AVAILABLE_OFFICE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex-shrink-0">
              {locationDisplayStatus === "loading" && (
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
              {locationDisplayStatus === "success" && (
                <LocateFixed className="w-6 h-6 text-green-500" />
              )}
              {locationDisplayStatus === "out_of_range" && (
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              )}
              {locationDisplayStatus === "error" && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              {locationDisplayStatus === "remote_selected" && (
                <Building className="w-6 h-6 text-purple-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {locationDisplayStatus === "loading" && "Mengecek lokasi..."}
                {locationDisplayStatus === "success" &&
                  "Dalam jangkauan kantor ✓"}
                {locationDisplayStatus === "out_of_range" &&
                  "Di luar jangkauan kantor"}
                {locationDisplayStatus === "error" && "Error lokasi"}
                {locationDisplayStatus === "remote_selected" &&
                  "Mode Lokasi Remote Aktif"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentLocation.address}
              </p>
              {currentLocation.accuracy &&
                locationDisplayStatus !== "remote_selected" &&
                locationDisplayStatus !== "error" && (
                  <p className="text-xs text-gray-400">
                    Akurasi: {Math.round(currentLocation.accuracy)}m
                  </p>
                )}
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Karyawan
            </label>
            <input
              type="text"
              value={employee.id}
              onChange={(e) =>
                setEmployee((prev) => ({ ...prev, id: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan ID karyawan"
            />
          </div>
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={employee.name}
                  onChange={(e) =>
                    setEmployee((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departemen
                </label>
                <input
                  type="text"
                  value={employee.department}
                  onChange={(e) =>
                    setEmployee((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan departemen"
                />
              </div>
            </>
          )}
          {mode === "attendance" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Absensi
              </label>
              <div className="flex gap-2">
                {["masuk", "pulang"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAttendanceType(type)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                      attendanceType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {type === "masuk" ? "Masuk" : "Pulang"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Verifikasi Wajah
            </h3>
            <div className="space-y-3">
              <CameraComponent
                ref={cameraRef}
                onReady={handleCameraReady}
                onFaceDetected={handleFaceDetected}
                onError={handleCameraError}
              />
              {cameraError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Error kamera: {cameraError}
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status kamera:</span>
                <span
                  className={`font-medium ${
                    isCameraReady ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCameraReady ? "Siap" : "Tidak Siap"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Wajah terdeteksi:</span>
                <span
                  className={`font-medium ${
                    facesDetected > 0 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {facesDetected}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Model AI:</span>
                <span
                  className={`font-medium ${
                    cameraRef.current?.areModelsLoaded()
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {cameraRef.current?.areModelsLoaded()
                    ? "Siap"
                    : "Memuat/Gagal"}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {mode === "register" ? (
              <button
                onClick={registerFace}
                disabled={
                  isRegistering || !isCameraReady || facesDetected === 0
                }
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mendaftarkan...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Daftarkan Wajah
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={processAttendance}
                disabled={
                  isProcessing ||
                  !isCameraReady ||
                  facesDetected === 0 ||
                  (selectedOffice.id !== "remote_default" &&
                    !isUserWithinRange) ||
                  (selectedOffice.id !== "remote_default" &&
                    locationDisplayStatus !== "success") ||
                  !currentValidateTimeStatus.valid
                }
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Absen {attendanceType === "masuk" ? "Masuk" : "Pulang"}
                  </>
                )}
              </button>
            )}
            {mode === "attendance" && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Jam {attendanceType}:</span>
                    <span className="font-medium">
                      {WORK_SCHEDULE[attendanceType]?.start} -{" "}
                      {WORK_SCHEDULE[attendanceType]?.end}
                      {attendanceType === "masuk" &&
                        WORK_SCHEDULE[attendanceType]?.grace &&
                        ` (+${WORK_SCHEDULE[attendanceType].grace} menit toleransi)`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status waktu:</span>
                    <span
                      className={`font-medium ${
                        currentValidateTimeStatus.valid
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {currentValidateTimeStatus.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {attendanceStatus && (
            <div
              className={`p-4 rounded-lg border-2 ${
                attendanceStatus.success
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {attendanceStatus.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{attendanceStatus.message}</p>
                  <div className="mt-1 space-y-1 text-sm">
                    <p>Waktu: {attendanceStatus.time}</p>
                    {attendanceStatus.employeeName && (
                      <p>Karyawan: {attendanceStatus.employeeName}</p>
                    )}
                    {attendanceStatus.confidence !== undefined && (
                      <p>
                        Akurasi pengenalan:{" "}
                        {attendanceStatus.confidence.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {registeredFaces.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Users className="w-4 h-4" />
                <span className="font-medium">
                  Wajah Terdaftar: {registeredFaces.length}
                </span>
              </div>
              <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
                {registeredFaces.map((face, index) => (
                  <div
                    key={index}
                    className="text-xs text-blue-700 flex justify-between"
                  >
                    <span>
                      {face.name} ({face.employeeId})
                    </span>
                    <span>{face.department}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
            <Wifi className="w-4 h-4" /> <span>Sistem Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
