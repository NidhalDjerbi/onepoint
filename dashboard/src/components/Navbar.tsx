import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Navbar() {
  const { logout } = useAuth();
  const { token } = useAuth();
  function handleLogout() {
    logout();
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        {token ? (
          <Button
            color="inherit"
            component={Link}
            to="/logout"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
