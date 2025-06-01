// CameraComponent.jsx - Fixed Version with AbortError handling
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import * as faceapi from "@vladmandic/face-api";

const CameraComponent = forwardRef(
  ({ onReady, onFaceDetected, onError }, ref) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const streamRef = useRef(null);
    const detectionIntervalRef = useRef(null);
    const isComponentMountedRef = useRef(true);
    const playRequestRef = useRef(null); // Track current play request
    const isVideoPlayingRef = useRef(false); // Track video playing state

    const [isReady, setIsReady] = useState(false);
    const [faceCount, setFaceCount] = useState(0);
    const [isDetecting, setIsDetecting] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    // Memoized callbacks untuk mencegah re-renders
    const handleCameraReady = useCallback(
      (ready) => {
        if (isComponentMountedRef.current) {
          setIsReady(ready);
          onReady?.(ready);
        }
      },
      [onReady]
    );

    const handleError = useCallback(
      (error) => {
        if (isComponentMountedRef.current) {
          console.error("[ERROR]", error);
          onError?.(error);
        }
      },
      [onError]
    );

    // Safe video play function with abort handling
    const safeVideoPlay = useCallback(
      async (videoElement) => {
        if (!videoElement || !isComponentMountedRef.current) return false;

        // Cancel previous play request if exists
        if (playRequestRef.current) {
          try {
            await playRequestRef.current.catch(() => {}); // Ignore previous errors
          } catch (e) {
            // Ignore cancellation errors
          }
        }

        try {
          // Check if video is already playing
          if (isVideoPlayingRef.current && !videoElement.paused) {
            console.log("[DEBUG] Video is already playing");
            return true;
          }

          console.log("[DEBUG] Attempting to play video...");
          playRequestRef.current = videoElement.play();

          await playRequestRef.current;

          if (isComponentMountedRef.current) {
            isVideoPlayingRef.current = true;
            console.log("[DEBUG] Video play successful");
            return true;
          }

          return false;
        } catch (error) {
          if (!isComponentMountedRef.current) return false;

          // Handle specific AbortError
          if (error.name === "AbortError") {
            console.log(
              "[DEBUG] Video play was interrupted by new load request - this is normal"
            );
            return false; // Don't treat as error, just return false
          }

          // Handle other play errors
          console.error("[ERROR] Video play failed:", error);
          const errorMessage =
            error.name === "NotAllowedError"
              ? "Autoplay diblokir browser. Silakan klik pada video untuk memulai."
              : `Gagal memulai video: ${error.message}`;

          handleError(errorMessage);
          return false;
        } finally {
          playRequestRef.current = null;
        }
      },
      [handleError]
    );

    // Load face detection models dengan error handling yang lebih baik
    const loadModels = useCallback(async () => {
      console.log("[DEBUG] Loading face detection models...");

      try {
        // Check if models are already loaded
        if (
          faceapi.nets.tinyFaceDetector.isLoaded &&
          faceapi.nets.faceLandmark68Net.isLoaded &&
          faceapi.nets.faceRecognitionNet.isLoaded
        ) {
          console.log("[DEBUG] Models already loaded");
          setModelsLoaded(true);
          return true;
        }

        const modelPath = "/models";

        // Load models dengan timeout
        const loadPromises = [
          faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        ];

        await Promise.race([
          Promise.all(loadPromises),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Model loading timeout")), 15000)
          ),
        ]);

        if (isComponentMountedRef.current) {
          setModelsLoaded(true);
          console.log("[SUCCESS] Face detection models loaded successfully");
        }
        return true;
      } catch (error) {
        const errorMsg = error.message.includes("timeout")
          ? "Timeout loading AI models. Periksa koneksi internet."
          : "Gagal memuat model AI. Pastikan folder /public/models berisi file model yang diperlukan.";

        if (isComponentMountedRef.current) {
          setModelsLoaded(false);
          handleError(errorMsg);
        }
        return false;
      }
    }, [handleError]);

    // Start camera dengan better error handling dan abort prevention
    const startCamera = useCallback(async () => {
      console.log("[DEBUG] Starting camera...");
      setIsReady(false);
      isVideoPlayingRef.current = false;

      if (!navigator.mediaDevices?.getUserMedia) {
        handleError("Browser tidak mendukung akses kamera");
        return;
      }

      try {
        // Stop existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // Cancel any pending play requests
        if (playRequestRef.current) {
          try {
            await playRequestRef.current.catch(() => {});
          } catch (e) {
            // Ignore
          }
          playRequestRef.current = null;
        }

        const constraints = {
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            facingMode: "user",
            frameRate: { ideal: 24, max: 30 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isComponentMountedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          const video = videoRef.current;

          // Clear previous event listeners
          video.onloadedmetadata = null;
          video.onerror = null;
          video.onended = null;
          video.onplay = null;
          video.onpause = null;

          // Set up new event handlers
          const handleLoadedMetadata = async () => {
            if (!video || !isComponentMountedRef.current) return;

            console.log(
              `[DEBUG] Video loaded: ${video.videoWidth}x${video.videoHeight}`
            );

            if (video.videoWidth === 0 || video.videoHeight === 0) {
              handleError("Video tidak memiliki dimensi yang valid");
              return;
            }

            setupOverlayCanvas();

            // Try to play video after metadata is loaded
            const playSuccess = await safeVideoPlay(video);
            if (playSuccess && isComponentMountedRef.current) {
              handleCameraReady(true);
            }
          };

          const handleVideoError = (error) => {
            console.error("[ERROR] Video error:", error);
            handleError("Terjadi kesalahan pada video stream");
          };

          const handlePlay = () => {
            if (isComponentMountedRef.current) {
              isVideoPlayingRef.current = true;
              console.log("[DEBUG] Video started playing");
            }
          };

          const handlePause = () => {
            if (isComponentMountedRef.current) {
              isVideoPlayingRef.current = false;
              console.log("[DEBUG] Video paused");
            }
          };

          const handleEnded = () => {
            console.warn("[WARN] Video stream ended");
            if (isComponentMountedRef.current) {
              setIsReady(false);
              isVideoPlayingRef.current = false;
            }
          };

          // Assign event handlers
          video.onloadedmetadata = handleLoadedMetadata;
          video.onerror = handleVideoError;
          video.onended = handleEnded;
          video.onplay = handlePlay;
          video.onpause = handlePause;

          // Set stream to video element
          video.srcObject = stream;
        }
      } catch (error) {
        console.error("[ERROR] Camera access failed:", error);

        const errorMessages = {
          NotAllowedError:
            "Izin akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.",
          NotFoundError:
            "Kamera tidak ditemukan. Pastikan kamera terhubung dan berfungsi.",
          NotReadableError:
            "Kamera sedang digunakan aplikasi lain atau ada masalah hardware.",
          OverconstrainedError:
            "Kamera tidak mendukung pengaturan yang diminta.",
        };

        const errorMessage =
          errorMessages[error.name] ||
          `Gagal mengakses kamera: ${error.message}`;
        handleError(errorMessage);
      }
    }, [handleError, handleCameraReady, safeVideoPlay]);

    // Setup overlay canvas
    const setupOverlayCanvas = useCallback(() => {
      if (overlayCanvasRef.current && videoRef.current) {
        const canvas = overlayCanvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        console.log(
          `[DEBUG] Overlay canvas setup: ${canvas.width}x${canvas.height}`
        );
      }
    }, []);

    // Draw detection frames - FIXED: Text tidak terbalik
    const drawDetectionFrames = useCallback((detections) => {
      const canvas = overlayCanvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video || !detections || !isComponentMountedRef.current)
        return;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        // Save current transform
        ctx.save();

        // Apply horizontal flip to match video mirror effect
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        // Set drawing style
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 3;
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 16px Arial";
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 3;

        detections.forEach((detection, index) => {
          const box = detection.detection.box;

          // Draw main rectangle
          ctx.beginPath();
          ctx.rect(box.x, box.y, box.width, box.height);
          ctx.stroke();

          // Draw corner markers
          const cornerSize = 15;
          const corners = [
            {
              x: box.x,
              y: box.y,
              lines: [
                [0, cornerSize],
                [cornerSize, 0],
              ],
            },
            {
              x: box.x + box.width,
              y: box.y,
              lines: [
                [0, cornerSize],
                [-cornerSize, 0],
              ],
            },
            {
              x: box.x,
              y: box.y + box.height,
              lines: [
                [0, -cornerSize],
                [cornerSize, 0],
              ],
            },
            {
              x: box.x + box.width,
              y: box.y + box.height,
              lines: [
                [0, -cornerSize],
                [-cornerSize, 0],
              ],
            },
          ];

          corners.forEach((corner) => {
            ctx.beginPath();
            corner.lines.forEach(([dx, dy]) => {
              ctx.moveTo(corner.x, corner.y);
              ctx.lineTo(corner.x + dx, corner.y + dy);
            });
            ctx.stroke();
          });

          // Draw label - FIXED: Text positioning untuk tidak terbalik
          const label = `Wajah ${index + 1}`;
          const labelY = box.y > 25 ? box.y - 10 : box.y + box.height + 20;

          // Reset transform temporarily for text
          ctx.restore();
          ctx.save();

          // Label background
          const labelWidth = ctx.measureText(label).width + 10;
          ctx.fillStyle = "rgba(0, 255, 0, 0.9)";
          ctx.fillRect(
            canvas.width - box.x - labelWidth + 2,
            labelY - 18,
            labelWidth,
            22
          );

          // Label text (tidak terbalik)
          ctx.fillStyle = "#000000";
          ctx.fillText(
            label,
            canvas.width - box.x - labelWidth + 7,
            labelY - 2
          );

          // Restore transform for next detection
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        });

        ctx.restore();
      }
    }, []);

    // Optimized face detection dengan throttling
    const detectFaces = useCallback(async () => {
      if (
        !videoRef.current ||
        !isReady ||
        isDetecting ||
        !modelsLoaded ||
        !isComponentMountedRef.current ||
        !isVideoPlayingRef.current
      ) {
        return;
      }

      const video = videoRef.current;
      if (
        video.paused ||
        video.ended ||
        video.readyState < 3 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        return;
      }

      setIsDetecting(true);

      try {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.6,
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (!isComponentMountedRef.current) return;

        const currentFaceCount = detections.length;

        setFaceCount(currentFaceCount);
        drawDetectionFrames(detections);
        onFaceDetected?.(currentFaceCount, currentFaceCount > 0, detections);

        console.log(`[DEBUG] Detected ${currentFaceCount} face(s)`);
      } catch (error) {
        console.error("[ERROR] Face detection failed:", error);
        // Don't show error to user for individual detection failures
      }

      if (isComponentMountedRef.current) {
        setIsDetecting(false);
      }
    }, [
      isReady,
      isDetecting,
      modelsLoaded,
      drawDetectionFrames,
      onFaceDetected,
    ]);

    // Start/stop face detection dengan cleanup yang lebih baik
    const startFaceDetection = useCallback(() => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }

      if (
        isReady &&
        modelsLoaded &&
        isComponentMountedRef.current &&
        isVideoPlayingRef.current
      ) {
        console.log("[DEBUG] Starting face detection interval");
        detectionIntervalRef.current = setInterval(detectFaces, 400);
      }
    }, [isReady, modelsLoaded, detectFaces]);

    const stopFaceDetection = useCallback(() => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
        console.log("[DEBUG] Face detection stopped");
      }
    }, []);

    // Manual play function for user interaction
    const handleManualPlay = useCallback(async () => {
      if (videoRef.current && !isVideoPlayingRef.current) {
        const success = await safeVideoPlay(videoRef.current);
        if (success && isComponentMountedRef.current && !isReady) {
          handleCameraReady(true);
        }
      }
    }, [safeVideoPlay, isReady, handleCameraReady]);

    // Imperative handle dengan error handling
    useImperativeHandle(
      ref,
      () => ({
        captureImage: () => {
          if (
            !videoRef.current ||
            !canvasRef.current ||
            !isComponentMountedRef.current ||
            !isVideoPlayingRef.current
          ) {
            console.warn("[WARN] Cannot capture: component not ready");
            return null;
          }

          const video = videoRef.current;
          if (video.readyState !== 4 || video.videoWidth === 0) {
            console.warn("[WARN] Cannot capture: video not ready");
            return null;
          }

          try {
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            return canvas.toDataURL("image/jpeg", 0.8);
          } catch (error) {
            console.error("[ERROR] Image capture failed:", error);
            return null;
          }
        },
        getVideoElement: () => videoRef.current,
        restartDetection: startFaceDetection,
        areModelsLoaded: () => modelsLoaded,
        isReady: () => isReady,
        playVideo: handleManualPlay, // Expose manual play for user interaction
      }),
      [startFaceDetection, modelsLoaded, isReady, handleManualPlay]
    );

    // Initialize component
    useEffect(() => {
      isComponentMountedRef.current = true;

      const initialize = async () => {
        setIsInitializing(true);

        try {
          const modelsSuccess = await loadModels();
          if (modelsSuccess && isComponentMountedRef.current) {
            await startCamera();
          }
        } catch (error) {
          console.error("[ERROR] Initialization failed:", error);
          handleError("Gagal menginisialisasi komponen kamera");
        } finally {
          if (isComponentMountedRef.current) {
            setIsInitializing(false);
          }
        }
      };

      initialize();

      // Cleanup function
      return () => {
        isComponentMountedRef.current = false;
        console.log("[DEBUG] Cleaning up camera component");

        stopFaceDetection();

        // Cancel any pending play requests
        if (playRequestRef.current) {
          playRequestRef.current.catch(() => {}); // Ignore errors
          playRequestRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        isVideoPlayingRef.current = false;
      };
    }, [loadModels, startCamera, stopFaceDetection, handleError]);

    // Auto-start detection when ready and playing
    useEffect(() => {
      if (isReady && modelsLoaded && isVideoPlayingRef.current) {
        startFaceDetection();
      } else {
        stopFaceDetection();
      }
    }, [isReady, modelsLoaded, startFaceDetection, stopFaceDetection]);

    return (
      <div className="relative bg-gray-900 rounded-lg overflow-hidden w-full aspect-[4/3] shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
          style={{ transform: "scaleX(-1)" }}
          onClick={handleManualPlay} // Allow manual play on click
        />
        <canvas
          ref={overlayCanvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Enhanced Status Overlays */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
              isReady && isVideoPlayingRef.current
                ? "bg-green-500 text-white shadow-lg"
                : "bg-amber-500 text-white animate-pulse"
            }`}
          >
            {isReady && isVideoPlayingRef.current
              ? "✓ Kamera Aktif"
              : "Memuat Kamera..."}
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
              modelsLoaded
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-red-500 text-white"
            }`}
          >
            {modelsLoaded ? "🤖 AI Siap" : "AI Error"}
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
              faceCount > 0
                ? "bg-purple-500 text-white shadow-lg animate-pulse"
                : "bg-gray-600 text-white"
            }`}
          >
            👤 {faceCount} Wajah
          </div>
        </div>

        {/* Detection indicator */}
        {isDetecting && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
        )}

        {/* Loading overlay dengan better UX */}
        {(isInitializing || !isReady) && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-20">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium mb-2">
                {isInitializing ? "Menginisialisasi..." : "Memuat kamera..."}
              </p>
              <p className="text-sm text-gray-300">
                Pastikan izin kamera telah diberikan
              </p>
              {!isVideoPlayingRef.current && !isInitializing && (
                <button
                  onClick={handleManualPlay}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Klik untuk Memulai
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error indicator jika tidak ada wajah terdeteksi dalam waktu lama */}
        {isReady &&
          modelsLoaded &&
          faceCount === 0 &&
          !isInitializing &&
          isVideoPlayingRef.current && (
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <div className="bg-yellow-600 bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm text-center">
                💡 Posisikan wajah Anda di tengah kamera
              </div>
            </div>
          )}
      </div>
    );
  }
);

CameraComponent.displayName = "CameraComponent";

export default CameraComponent;
