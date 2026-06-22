import type { User } from "../constants/mockUsers";
import { mockUsers } from "../constants/mockUsers";

export class UserService {
  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAll(): Promise<User[]> {
    await this.delay(300);
    return [...mockUsers];
  }

  static async getById(id: string): Promise<User | null> {
    await this.delay(200);
    return mockUsers.find((u) => u.id === id) || null;
  }

  static async create(data: Omit<User, "id" | "createdAt">): Promise<User> {
    await this.delay(400);
    const newUser: User = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.delay(300);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;
    mockUsers[index] = { ...mockUsers[index], ...data };
    return mockUsers[index];
  }

  static async delete(id: string): Promise<boolean> {
    await this.delay(300);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) return false;
    mockUsers.splice(index, 1);
    return true;
  }

  static async toggleStatus(id: string): Promise<User | null> {
    await this.delay(200);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) return null;
    user.status = user.status === "active" ? "inactive" : "active";
    return { ...user };
  }
}
