import React, { useEffect, useState } from "react";

import { Link as NavLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SyncIcon from "@mui/icons-material/Sync";

import Expander from "./Expander";
import ThemeToggle from "./ThemeToggle";
import DialogLogin from "./DialogLogin";

import { useAppSelector, useAppDispatch } from "../store";
import { authLogin, authLogout, authSubscribe } from "../store/slices/auth";

export default function Nav(): React.ReactElement {
  const [dialogLoginOpen, setDialogLoginOpen] = useState(false);

  const { isAuth, isKnown } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // subscribe to auth updates
  useEffect(() => {
    const unsubscribe = dispatch(authSubscribe());

    // will be called on unmount
    return unsubscribe;
  }, [dispatch]);

  const loginOrLogout = () => {
    if (!isKnown) return;

    if (isAuth) dispatch(authLogout());
    else setDialogLoginOpen(true);
  };

  const handleDialogLoginClose = (credentials?: {
    email: string;
    password: string;
  }) => {
    setDialogLoginOpen(false);
    if (credentials) {
      // send login or logout action
      dispatch(authLogin(credentials.email, credentials.password));
    }
  };

  return (
    <>
      <Link component={NavLink} to="/users" color="inherit" sx={{ mr: 1 }}>
        Users
      </Link>

      <Link component={NavLink} to="/activities" color="inherit" sx={{ mr: 1 }}>
        Activities
      </Link>

      <Expander />

      <ThemeToggle />

      <Tooltip title={isKnown ? (isAuth ? "Logout" : "Login") : false}>
        <IconButton color="inherit" onClick={() => loginOrLogout()}>
          {isKnown ? isAuth ? <LogoutIcon /> : <LoginIcon /> : <SyncIcon />}
        </IconButton>
      </Tooltip>

      <DialogLogin open={dialogLoginOpen} onClose={handleDialogLoginClose} />
    </>
  );
}
