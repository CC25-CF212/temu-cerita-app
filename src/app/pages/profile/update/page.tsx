"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Edit3, Camera, Save, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Head from "next/head";
import Header from "@/components/pages/components/layout/Header";
import Footer from "@/components/pages/components/layout/Footer";
import AnimatedText from "@/lib/AnimatedText";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
  active: boolean;
  admin: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<ProfileData | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthStore();

  // Ambil data profil dari API saat mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        if (user) {
          const res = await fetch(`/api/users/${user.id}`);
          if (!res.ok) throw new Error("Failed to fetch profile");
          const hasil = await res.json();
          const data: ProfileData = hasil.data;
          setProfileData(data);
          setEditData(data);
          setPreviewImage(data.profile_picture);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };
    fetchProfile();
  }, [user]);

  const handleEditToggle = (): void => {
    if (isEditing && profileData) {
      setEditData(profileData);
      setPreviewImage(profileData.profile_picture);
    }
    setIsEditing(!isEditing);
  };

  // Simpan data ke API pakai POST dengan FormData
  const handleSave = async (): Promise<void> => {
    if (!editData) return;

    setLoading(true); // Set loading to true before saving
    const formData = new FormData();
    formData.append("id", editData.id);
    formData.append("name", editData.name);
    formData.append("email", editData.email);
    if (previewImage.startsWith("data:image")) {
      // konversi base64 ke Blob
      const res = await fetch(previewImage);
      const blob = await res.blob();
      formData.append("profile_picture", blob, "profile_picture.png");
    } else {
      // Jika previewImage adalah URL, kirim sebagai string biasa
      formData.append("profile_picture_url", previewImage);
    }

    try {
      const res = await fetch("/api/users/profile", {
        method: "POST",
        body: formData,
      });
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      if (!res.ok) {
        throw new Error("Gagal menyimpan profil");
      }

      // Update profileData dari editData setelah berhasil simpan
      setProfileData(editData);
      setIsEditing(false);
      alert("Profil berhasil disimpan");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan profil");
    } finally {
      setLoading(false); // Set loading to false after saving (success or error)
    }
  };

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | boolean
  ): void => {
    if (!editData) return;
    setEditData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl = e.target?.result as string;
        setPreviewImage(imageUrl);
        if (editData) {
          setEditData({
            ...editData,
            profile_picture: imageUrl,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading spinner
  if (loading || !user) {
    // Also check for user presence before rendering profile
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If data is still not loaded after loading state is false (e.g., error), show a fallback message
  if (!profileData || !editData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>TemuCerita - Profile</title>
        <meta
          name="description"
          content="Discover stories and articles on TemuCerita"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-8 min-h-screen">
        
          <AnimatedText text="Profile" />
          <div className="text-center mb-8"></div>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800"></h1>
            <button
              onClick={handleEditToggle}
              // Changed this button to green as well
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isEditing ? <X size={20} /> : <Edit3 size={20} />}
              {isEditing ? "Batal" : "Edit Profil"}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Changed from bg-green-600 to a gradient */}
            
            <div className="relative px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <div className="relative inline-block">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  {isEditing && (
                    <button
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Camera size={20} />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Nama Lengkap
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-800">
                      {profileData.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg text-gray-800">{profileData.email}</p>
                  )}
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    User ID
                  </label>
                  <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-2 rounded-lg">
                    {profileData.id}
                  </p>
                </div>

                {/* Created At */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Bergabung Sejak
                  </label>
                  <p className="text-sm text-gray-700">
                    {formatDate(profileData.createdAt)}
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Status Akun
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profileData.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profileData.active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                </div>

                {/* Admin Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profileData.admin
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {profileData.admin ? "Administrator" : "User "}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-8 pb-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={20} />
                    Simpan Perubahan
                  </button>
                </div>
              )}
              <div className="mt-8 pb-8 flex "></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
