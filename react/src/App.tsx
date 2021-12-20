import React, { useState } from "react";

import { Routes, Route } from "react-router-dom";

import {
  CssBaseline,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Divider,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";

// import logo from "./logo.svg";

import ThemeProvider, { Theme } from "./contexts/ThemeProvider";

import Copyright from "./components/Copyright";
import Nav from "./components/Nav";
import AppBar from "./components/AppBar";
import AppDrawer from "./components/AppDrawer";
import Users from "./components/Users";
import Activities from "./components/Activities";
import useNotifications from "./hooks/useNotifications";

const drawerWidth = 240;

function App(): React.ReactElement {
  // use/show any notifications - actually it will re-pass to useSnackbar internally
  // the showing/adding and dismissing of notifications is from using the store and
  // dispatching a notification action
  useNotifications();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawerOpen = () => setDrawerOpen(!isDrawerOpen);

  return (
    <ThemeProvider>
      <CssBaseline />

      <Box sx={{ display: "flex" }}>
        <AppBar
          position="absolute"
          drawerWidth={drawerWidth}
          open={isDrawerOpen}
        >
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title="Toggle menu">
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawerOpen}
                sx={{
                  mr: 4,
                  ...(isDrawerOpen && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Typography component="h1" variant="h6" color="inherit" noWrap>
              Calendar Activities
            </Typography>

            <Divider
              orientation="vertical"
              variant="middle"
              light
              flexItem
              sx={{ mx: 1, borderColor: "inherit" }}
            />

            <Nav />
          </Toolbar>
        </AppBar>
        <AppDrawer
          variant="permanent"
          open={isDrawerOpen}
          drawerWidth={drawerWidth}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawerOpen}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </List>
        </AppDrawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme: Theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          {/* this is "artificial" toolbar just to take the same space
        as the AppBar toolbar component which is with absolute position */}
          <Toolbar />

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/activities" element={<Activities />} />

              {/* no match route */}
              <Route
                path="*"
                element={
                  <Typography color="error">There's nothing here!</Typography>
                }
              />
            </Routes>

            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
