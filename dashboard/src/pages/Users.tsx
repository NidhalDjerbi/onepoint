import { Container, Typography, TextField } from "@mui/material";
import { useState } from "react";
import UsersTable from "../components/UsersTable";

function Users() {
  const [search, setSearch] = useState("");

  return (
    <Container>
      <Typography variant="h4">Users List</Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <UsersTable search={search} />
    </Container>
  );
}

export default Users;
