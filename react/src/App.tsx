import React, { useState } from "react";

import { Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

// import logo from "./logo.svg";

import ThemeProvider, { Theme } from "./contexts/ThemeProvider";

import Copyright from "./components/Copyright";
import Nav from "./components/Nav";
import AppBar from "./components/AppBar";
import Users from "./components/Users";
import Activities from "./components/Activities";
import Notifications from "./components/Notifications";

import useAuth from "./hooks/useAuth";

function App(): React.ReactElement {
  const [isDrawerOpen, setDrawerOpen] = useState(true);

  const [isAuth, login, logout] = useAuth();

  return (
    <ThemeProvider>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed,
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(!isDrawerOpen)}
            sx={{
              // mr: "36px",
              mr: 4,
              ...(isDrawerOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Calendar Activities
          </Typography>
          <IconButton color="inherit" onClick={() => (isAuth ? logout() : login())}>
            {!isAuth && <LoginIcon />}
            {isAuth && <LogoutIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Nav />

          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />

            {/* no match route */}
            <Route path="*" element={<Typography color="error">There's nothing here!</Typography>} />
          </Routes>

          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>

      <Notifications />
    </ThemeProvider>
  );
}
export default App;
