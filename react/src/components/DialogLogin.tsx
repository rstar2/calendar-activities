import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";

type DialogLoginProps = {
  open: boolean;
  onClose: (value?: { email: string; password: string }) => void;
};
export default function DialogLogin(props: DialogLoginProps): React.ReactElement {
  const { open, onClose } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleOk = () => {
    onClose({ email, password });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" my={1}>
          {/* show the email input */}
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {/* show the password input */}
          <FormControl variant="outlined" sx={{ mt: 2 }}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!isShowPassword)}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleOk} disabled={!email || !password}>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
