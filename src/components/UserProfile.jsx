// components/UserProfile.jsx
"use client";
import { useAuthStore } from "@/store/authStore";
import { useApiWithAuth } from "@/hooks/useApiWithAuth";

export default function UserProfile() {
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const { apiCall } = useApiWithAuth();

  if (!isAuthenticated) {
    return <div>Please login first</div>;
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await apiCall("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({ name: "New Name" }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update state
        useAuthStore.getState().updateUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {isAdmin() && <p>You are an admin!</p>}
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
}

// // components/ProtectedRoute.jsx
// import { useAuthStore } from '@/store/authStore'
// import { redirect } from 'next/navigation'

// export function ProtectedRoute({ children, adminOnly = false }) {
//   const { isAuthenticated, isAdmin } = useAuthStore()

//   if (!isAuthenticated) {
//     redirect('/pages/login')
//   }

//   if (adminOnly && !isAdmin()) {
//     redirect('/unauthorized')
//   }

//   return children
// }

// // pages/dashboard/page.jsx
// import { ProtectedRoute } from '@/components/ProtectedRoute'
// import UserProfile from '@/components/UserProfile'

// export default function Dashboard() {
//   return (
//     <ProtectedRoute>
//       <div>
//         <h1>Dashboard</h1>
//         <UserProfile />
//       </div>
//     </ProtectedRoute>
//   )
// }
