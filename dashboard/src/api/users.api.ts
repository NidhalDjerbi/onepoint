import api from "./api";

interface FetchUserResponse {
  total: number;
  page: number;
  limit: number;
  users: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    createdAt: string;
  }[];
}
export const fetchUsers = async (
  page: number,
  rowsPerPage: number,
  search: string,
  sortBy: string,
  order: string
) => {
  const { data } = await api.get<FetchUserResponse>(
    `/users?page=${page}&search=${search}&limit=${rowsPerPage}&sortBy=${sortBy}&order=${order}`
  );
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

export interface AddUserResponse {
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
export const addUser = async (user: User): Promise<AddUserResponse> => {
  const { data } = await api.post<AddUserResponse>("/users", user);
  return data;
};

// Fetch a user by ID
export const fetchUserById = async (id: number): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
};

// Update a user
export interface UpdateUserResponse {
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

export const updateUser = async (
  id: number,
  user: User
): Promise<UpdateUserResponse> => {
  const { data } = await api.put<UpdateUserResponse>(`/users/${id}`, user);
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
