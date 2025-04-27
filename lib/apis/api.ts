import { AuthResponse, LoginCredentials, RegisterData } from "@/types/auth";
import axiosInstance from "@/lib/apis/axios";
import { Board, CreateBoardData } from "@/types/board";
import { Column } from "@/types/column";
import { CreateTask, Task } from "@/types/task";

// Auth
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", {
    username: userData.username,
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    password: userData.password,
  });
  return response.data;
};

// Board
export interface MyBoardsResponse {
  created_boards: Board[] | null;
  joined_boards: Board[] | null;
}

export const fetchMyBoards = async (): Promise<MyBoardsResponse> => {
  const response = await axiosInstance.get("/boards/my");
  return response.data;
};

export const createBoard = async (data: CreateBoardData): Promise<Board> => {
  try {
    const response = await axiosInstance.post("/boards", data);
    return response.data;
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

// Column
// ดึง columns ทั้งหมดใน board
export const fetchColumns = async (board_id: number): Promise<Column[]> => {
  const response = await axiosInstance.get("/columns", {
    params: { board_id },
  });
  return response.data;
};

// สร้าง column ใหม่
export const createColumn = async (data: {
  board_id: number;
  name: string;
}): Promise<Column> => {
  try {
    const response = await axiosInstance.post("/columns", data);
    return response.data;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
};

// ขยับ (move) column
export const moveColumn = async (
  column_id: number,
  board_id: number,
  position: number
): Promise<Column> => {
  try {
    const response = await axiosInstance.patch(
      `/columns/${column_id}/position`,
      { board_id, position }
    );
    return response.data;
  } catch (error) {
    console.error("Error moving column:", error);
    throw error;
  }
};

// Task
export const fetchTasksByColumn = async (
  column_id: number
): Promise<Task[]> => {
  const response = await axiosInstance.get("/tasks", {
    params: { column_id },
  });
  return response.data;
};

export const createTask = async (data: CreateTask): Promise<Task> => {
  try {
    const response = await axiosInstance.post("/tasks", data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const moveTask = async (
  task_id: number,
  newPosition: number
): Promise<Task> => {
  try {
    const response = await axiosInstance.patch(`/tasks/${task_id}/position`, {
      position: newPosition,
    });
    return response.data;
  } catch (error) {
    console.error("Error moving task:", error);
    throw error;
  }
};
