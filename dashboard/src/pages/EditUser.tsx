import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  updateUser,
  fetchUserById,
  User,
  UpdateUserResponse,
} from "../api/users.api";
import { useEffect } from "react";
import { updateUserSchema } from "../validator/UserSchema";

const UpdateUser = () => {
  const { id } = useParams<{ id: string }>(); // Get the user ID from the URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch the user data by ID to populate the form
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(Number(id)),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(updateUserSchema),
  });

  // Populate the form with the fetched user data
  useEffect(() => {
    if (user) {
      const formattedBirthdate = user.birthdate
        ? new Date(user.birthdate).toISOString().split("T")[0]
        : "";
      reset({
        ...user,
        birthdate: formattedBirthdate,
      });
    }
  }, [user, reset]);

  // React Query Mutation for Updating User
  const mutation = useMutation<UpdateUserResponse, Error, User>({
    mutationFn: (updatedUser) => updateUser(Number(id), updatedUser), // Pass the user ID and updated data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh users list
      queryClient.invalidateQueries({ queryKey: ["user", id] }); // Refresh the specific user's data
      navigate("/users"); // Redirect after updating
    },
    onError: (error: Error) => {
      console.error("Error updating user:", error);
    },
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error fetching user data</Typography>;

  return (
    <Container>
      <Typography variant="h4">Modifier un utilisateur</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="FirstName"
          fullWidth
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName ? String(errors.firstName.message) : ""}
        />
        <TextField
          label="LastName"
          fullWidth
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message?.toString()}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
        />
        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          {...register("birthdate")}
          error={!!errors.birthdate}
          helperText={errors.birthdate ? String(errors.birthdate.message) : ""}
        />

        <Button type="submit" variant="contained" color="primary">
          Modifier
        </Button>
      </form>
    </Container>
  );
};

export default UpdateUser;
