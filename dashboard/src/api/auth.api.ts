import api from "./api";

interface LoginResponse {
  message: string;
  data: string;
}

export const loginUser = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return data;
};

// add all api
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    createdAt: string;
  };
}
export const registerUser = async (user: User): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>("/auth/register", user);
  return data;
};
