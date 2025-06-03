// lib/userService.ts
export interface User {
  id: number;
  name: string;
  email: string;
  activeDate: string;
  isActive?: boolean;
  isAdmin?: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

class UserService {
  private baseUrl = "/api/users";

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
        cache: "no-store", // Untuk data yang sering berubah
      });
      const hasil = await response.json();
      console.log("Fetching all users from:", hasil);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      return hasil.data as User[];
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error;
    }
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw error;
    }
  }

  // Toggle user active status
  async toggleUserActive(id: number): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/toggle-active`, {
        method: "PATCH",
      });
      const hasil = await response.json();
      console.log("Toggling user active status:", hasil);
      if (!response.ok) {
        throw new Error(
          `Failed to toggle user active status: ${response.status}`
        );
      }

      return hasil;
    } catch (error) {
      console.error("Error in toggleUserActive:", error);
      throw error;
    }
  }

  // Set admin status
  async setAdminStatus(id: number, isAdmin: boolean): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/admin-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin }),
      });

      if (!response.ok) {
        throw new Error(`Failed to set admin status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in setAdminStatus:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
