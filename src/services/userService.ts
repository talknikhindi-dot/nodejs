import { query } from "../config/db.ts";
import { User } from "../models/userModel.ts";

export const getAllUsers = async (): Promise<User[]> => {
  // Note: This will only work if the 'users' table exists
  // For now, we'll return a mock if the connection string is missing
  if (!process.env.DATABASE_URL) {
    return [
      { id: 1, username: "admin", email: "admin@example.com", created_at: new Date() }
    ];
  }
  
  const result = await query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
};

export const getUserById = async (id: number): Promise<User | null> => {
  if (!process.env.DATABASE_URL) return null;
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};
