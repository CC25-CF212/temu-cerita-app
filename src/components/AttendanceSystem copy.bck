import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Calendar,
  Wifi,
  WifiOff,
  UserPlus,
  Users,
} from "lucide-react";

const AttendanceSystemaa = () => {
  const [currentTime, setCurrentTime] = useState(null);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [attendanceType, setAttendanceType] = useState("masuk");
  const [employee, setEmployee] = useState({
    id: "",
    name: "",
    department: "",
  });
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationStatus, setLocationStatus] = useState("loading");
  const [isClient, setIsClient] = useState(false);
  const [mode, setMode] = useState("attendance"); // 'attendance' or 'register'
  const [registeredFaces, setRegisteredFaces] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Konfigurasi jam kerja (jam yang lebih fleksibel)
  const WORK_SCHEDULE = {
    masuk: {
      start: "06:00",
      end: "10:00", // 4 jam window
      grace: 30, // menit toleransi tambahan
    },
    pulang: {
      start: "15:00",
      end: "19:00", // 4 jam window
    },
  };

  // Lokasi kantor
  const OFFICE_LOCATION = {
    latitude: -6.2,
    longitude: 106.816666,
    radius: 100,
  };

  useEffect(() => {
    const savedFaces = JSON.parse(
      localStorage.getItem("registeredFaces") || "[]"
    );
    setRegisteredFaces(savedFaces);
  }, []);

  // Save faces to localStorage simulation
  const saveFacesToStorage = (faces) => {
    // In real implementation, this would be sent to a server
    // For demo purposes, we'll use a state variable instead of localStorage
    setRegisteredFaces(faces);
    console.log("Faces saved to database:", faces.length, "faces registered");
  };

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    getCurrentLocation();
  }, [isClient]);

  if (!isClient || !currentTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">Sistem Absensi</h1>
              <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                <Calendar className="w-4 h-4" />
                <span>Loading...</span>
              </div>
              <div className="text-2xl font-bold mt-2">--:--:--</div>
            </div>
          </div>
          <div className="p-6 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getCurrentLocation = () => {
    setLocationStatus("loading");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            latitude,
            longitude,
            address: "Mendapatkan alamat...",
          });

          setTimeout(() => {
            setLocation((prev) => ({
              ...prev,
              address: "Jl. Sudirman No. 123, Jakarta Pusat",
            }));
            setLocationStatus("success");
          }, 1000);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus("error");
          setLocation({
            latitude: null,
            longitude: null,
            address: "Lokasi tidak tersedia",
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationStatus("error");
      setLocation({
        latitude: null,
        longitude: null,
        address: "Geolocation tidak didukung",
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Tidak dapat mengakses kamera. Pastikan browser memiliki izin kamera."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      return canvas.toDataURL("image/jpeg");
    }
    return null;
  };

  // Simulasi face recognition - dalam implementasi nyata akan menggunakan ML model
  const recognizeFace = (capturedImage) => {
    // Simulasi perbandingan dengan wajah yang terdaftar
    if (registeredFaces.length === 0) {
      return { recognized: false, employeeId: null, confidence: 0 };
    }

    // Simulasi recognition berdasarkan ID yang diinput
    const matchingFace = registeredFaces.find(
      (face) => face.employeeId === employee.id
    );

    if (matchingFace) {
      // Simulasi confidence score (85-95% untuk match, 60-80% untuk tidak match)
      const confidence = Math.random() * 10 + 85; // 85-95%
      return {
        recognized: confidence > 80,
        employeeId: matchingFace.employeeId,
        confidence: confidence,
        name: matchingFace.name,
      };
    }

    return {
      recognized: false,
      employeeId: null,
      confidence: Math.random() * 20 + 60, // 60-80%
    };
  };

  const registerFace = async () => {
    setIsRegistering(true);

    if (!employee.id || !employee.name || !employee.department) {
      alert("Mohon lengkapi semua data karyawan");
      setIsRegistering(false);
      return;
    }

    if (!isCameraActive) {
      alert("Mohon aktifkan kamera terlebih dahulu");
      setIsRegistering(false);
      return;
    }

    const faceImage = captureImage();
    if (!faceImage) {
      alert("Gagal mengambil foto wajah");
      setIsRegistering(false);
      return;
    }

    // Check if employee already registered
    const existingFace = registeredFaces.find(
      (face) => face.employeeId === employee.id
    );
    if (existingFace) {
      alert("Karyawan sudah terdaftar dalam sistem");
      setIsRegistering(false);
      return;
    }

    // Simulasi proses registrasi
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newFace = {
      employeeId: employee.id,
      name: employee.name,
      department: employee.department,
      faceImage: faceImage,
      registeredAt: new Date().toISOString(),
      // Dalam implementasi nyata, ini akan menjadi feature vector dari ML model
      faceFeatures: Array.from({ length: 128 }, () => Math.random()),
    };

    const updatedFaces = [...registeredFaces, newFace];
    saveFacesToStorage(updatedFaces);

    setAttendanceStatus({
      success: true,
      message: "Wajah berhasil didaftarkan!",
      status: "registered",
      time: currentTime.toLocaleTimeString("id-ID"),
    });

    setIsRegistering(false);
    stopCamera();

    setTimeout(() => {
      setAttendanceStatus(null);
      setEmployee({ id: "", name: "", department: "" });
      setMode("attendance");
    }, 3000);
  };

  const validateTime = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    const schedule = WORK_SCHEDULE[attendanceType];
    const startTime = schedule.start.split(":");
    const endTime = schedule.end.split(":");
    const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
    const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
    const currentMinutes = currentHour * 60 + currentMinute;

    if (attendanceType === "masuk") {
      const graceMinutes = schedule.grace || 0;
      return {
        valid:
          currentMinutes >= startMinutes &&
          currentMinutes <= endMinutes + graceMinutes,
        status:
          currentMinutes > endMinutes + graceMinutes
            ? "terlambat"
            : currentMinutes > endMinutes
            ? "terlambat_toleransi"
            : "tepat_waktu",
      };
    } else {
      return {
        valid: currentMinutes >= startMinutes && currentMinutes <= endMinutes,
        status: currentMinutes < startMinutes ? "terlalu_awal" : "tepat_waktu",
      };
    }
  };

  const validateLocation = () => {
    if (!location.latitude || !location.longitude) return false;

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      OFFICE_LOCATION.latitude,
      OFFICE_LOCATION.longitude
    );

    return distance <= OFFICE_LOCATION.radius;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const processAttendance = async () => {
    setIsProcessing(true);

    if (!employee.id) {
      alert("Mohon masukkan ID karyawan");
      setIsProcessing(false);
      return;
    }

    if (!isCameraActive) {
      alert("Mohon aktifkan kamera terlebih dahulu");
      setIsProcessing(false);
      return;
    }

    const faceImage = captureImage();
    if (!faceImage) {
      alert("Gagal mengambil foto wajah");
      setIsProcessing(false);
      return;
    }

    // Face recognition
    const recognition = recognizeFace(faceImage);
    if (!recognition.recognized) {
      alert(
        `Wajah tidak dikenali (confidence: ${recognition.confidence.toFixed(
          1
        )}%). Pastikan Anda sudah terdaftar dalam sistem.`
      );
      setIsProcessing(false);
      return;
    }

    // Auto-fill employee data from recognition
    const recognizedEmployee = registeredFaces.find(
      (face) => face.employeeId === recognition.employeeId
    );
    if (recognizedEmployee) {
      setEmployee({
        id: recognizedEmployee.employeeId,
        name: recognizedEmployee.name,
        department: recognizedEmployee.department,
      });
    }

    // Validasi waktu
    const timeValidation = validateTime();
    if (!timeValidation.valid) {
      const message =
        attendanceType === "masuk"
          ? `Waktu absen masuk: ${WORK_SCHEDULE.masuk.start} - ${WORK_SCHEDULE.masuk.end} (+ ${WORK_SCHEDULE.masuk.grace} menit toleransi)`
          : `Waktu absen pulang: ${WORK_SCHEDULE.pulang.start} - ${WORK_SCHEDULE.pulang.end}`;
      alert(`Diluar jam absen yang diizinkan. ${message}`);
      setIsProcessing(false);
      return;
    }

    // Validasi lokasi
    const locationValid = validateLocation();
    if (!locationValid) {
      alert("Anda berada diluar area kantor. Absensi tidak dapat dilakukan.");
      setIsProcessing(false);
      return;
    }

    // Simulasi delay processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const attendanceData = {
      employeeId: recognition.employeeId,
      employeeName: recognition.name,
      department: recognizedEmployee.department,
      type: attendanceType,
      timestamp: currentTime.toISOString(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      },
      status: timeValidation.status,
      faceImage: faceImage,
      recognitionConfidence: recognition.confidence,
    };

    console.log("Attendance Data:", attendanceData);

    setAttendanceStatus({
      success: true,
      message: `Absen ${attendanceType} berhasil dicatat!`,
      status: timeValidation.status,
      time: currentTime.toLocaleTimeString("id-ID"),
      confidence: recognition.confidence,
      employeeName: recognition.name,
    });

    setIsProcessing(false);
    stopCamera();

    setTimeout(() => {
      setAttendanceStatus(null);
      setEmployee({ id: "", name: "", department: "" });
    }, 3000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">Sistem Absensi</h1>
            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("attendance");
                setAttendanceStatus(null);
                setEmployee({ id: "", name: "", department: "" });
                stopCamera();
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                mode === "attendance"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Clock className="w-4 h-4" />
              Absensi
            </button>
            <button
              onClick={() => {
                setMode("register");
                setAttendanceStatus(null);
                setEmployee({ id: "", name: "", department: "" });
                stopCamera();
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                mode === "register"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Daftar Wajah
            </button>
          </div>
        </div>

        {/* Status Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 rounded-full ${
                locationStatus === "success"
                  ? "bg-green-100"
                  : locationStatus === "error"
                  ? "bg-red-100"
                  : "bg-yellow-100"
              }`}
            >
              {locationStatus === "success" ? (
                <MapPin className="w-5 h-5 text-green-600" />
              ) : locationStatus === "error" ? (
                <WifiOff className="w-5 h-5 text-red-600" />
              ) : (
                <Wifi className="w-5 h-5 text-yellow-600 animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Lokasi Saat Ini</div>
              <div className="text-xs text-gray-500 truncate">
                {location.address}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{registeredFaces.length} wajah terdaftar dalam sistem</span>
          </div>
        </div>

        {attendanceStatus ? (
          /* Success Message */
          <div className="p-6 text-center">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                attendanceStatus.success ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {attendanceStatus.success ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {attendanceStatus.message}
            </h3>
            {attendanceStatus.employeeName && (
              <p className="text-sm text-gray-600 mb-1">
                Karyawan: {attendanceStatus.employeeName}
              </p>
            )}
            <p className="text-sm text-gray-600">
              Waktu: {attendanceStatus.time}
            </p>
            {attendanceStatus.confidence && (
              <p className="text-sm text-blue-600 mt-1">
                Akurasi: {attendanceStatus.confidence.toFixed(1)}%
              </p>
            )}
            {(attendanceStatus.status === "terlambat" ||
              attendanceStatus.status === "terlambat_toleransi") && (
              <p className="text-sm text-red-600 mt-1">
                Status:{" "}
                {attendanceStatus.status === "terlambat_toleransi"
                  ? "Terlambat (dalam toleransi)"
                  : "Terlambat"}
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Form Input */}
            <div className="p-6 space-y-4">
              {/* Employee Info */}
              <div className="space-y-3">
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
                          setEmployee((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departemen
                      </label>
                      <select
                        value={employee.department}
                        onChange={(e) =>
                          setEmployee((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Pilih Departemen</option>
                        <option value="IT">IT</option>
                        <option value="HR">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Attendance Type (only for attendance mode) */}
              {mode === "attendance" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Absensi
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAttendanceType("masuk")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-xs ${
                        attendanceType === "masuk"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Masuk ({WORK_SCHEDULE.masuk.start}-
                      {WORK_SCHEDULE.masuk.end})
                    </button>
                    <button
                      onClick={() => setAttendanceType("pulang")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-xs ${
                        attendanceType === "pulang"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Pulang ({WORK_SCHEDULE.pulang.start}-
                      {WORK_SCHEDULE.pulang.end})
                    </button>
                  </div>
                </div>
              )}

              {/* Camera Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === "register"
                    ? "Foto Wajah Untuk Registrasi"
                    : "Verifikasi Wajah"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {isCameraActive ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-48 object-cover rounded-lg bg-black"
                      />
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-40 border-2 border-white rounded-lg"></div>
                      </div>
                      <button
                        onClick={stopCamera}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 mb-4">
                        Posisikan wajah Anda di dalam frame
                      </p>
                      <button
                        onClick={startCamera}
                        className={`px-4 py-2 rounded-lg transition-colors text-white ${
                          mode === "register"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        Aktifkan Kamera
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={mode === "register" ? registerFace : processAttendance}
                disabled={
                  (mode === "register" ? isRegistering : isProcessing) ||
                  !isCameraActive
                }
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  (mode === "register" ? isRegistering : isProcessing) ||
                  !isCameraActive
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : mode === "register"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : attendanceType === "masuk"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {mode === "register" ? (
                  isRegistering ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mendaftarkan Wajah...
                    </div>
                  ) : (
                    "Daftarkan Wajah"
                  )
                ) : isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </div>
                ) : (
                  `Absen ${
                    attendanceType.charAt(0).toUpperCase() +
                    attendanceType.slice(1)
                  }`
                )}
              </button>
            </div>
          </>
        )}

        {/* Hidden Canvas for Image Capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default AttendanceSystemaa;
