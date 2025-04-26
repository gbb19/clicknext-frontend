export interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
  updateAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
