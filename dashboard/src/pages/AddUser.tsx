import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser, AddUserResponse, User } from "../api/users.api";
import { addUserSchema } from "../validator/UserSchema";

const AddUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(addUserSchema),
  });

  // React Query Mutation for Adding User
  const mutation = useMutation<AddUserResponse, Error, User>({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (error: Error) => {
      const errorMessage =
        (error as any).response?.data?.error || error.message;
      window.alert("Error adding user: " + errorMessage);
    },
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  return (
    <Container>
      <Typography variant="h4">Add User</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="FirstName"
          fullWidth
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField
          label="LastName"
          fullWidth
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          {...register("birthdate")}
          error={!!errors.birthdate}
          helperText={errors.birthdate?.message}
        />
        <Button type="submit" variant="contained" color="primary">
          Add User
        </Button>
      </form>
    </Container>
  );
};

export default AddUser;
