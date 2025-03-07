import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, fetchUsers } from "../api/users.api";

function UsersTable({ search }: { search: string }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("firstName");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const queryClient = useQueryClient();

  // Fetch users data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", page, rowsPerPage, search, sortBy, order],
    queryFn: () => fetchUsers(page + 1, rowsPerPage, search, sortBy, order),
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSort = (column: string) => {
    const newOrder =
      sortBy === column ? (order === "asc" ? "desc" : "asc") : "asc";
    setSortBy(column);
    setOrder(newOrder);
    refetch();
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error || !data) return <Typography>Error loading users</Typography>;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/adduser" // Link to the add user page
        >
          Add User
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            {["id", "firstName", "email"].map((column) => (
              <TableCell key={column}>
                <TableSortLabel
                  active={sortBy === column}
                  direction={sortBy === column ? order : "asc"}
                  onClick={() => handleSort(column)}
                >
                  {column.toUpperCase()}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  color="primary"
                  component={Link}
                  to={`/updateuser/${user.id}`}
                >
                  Edit
                </Button>
                <Button
                  color="secondary"
                  onClick={() => handleDelete(user.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data.total ?? 0}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </>
  );
}

export default UsersTable;
