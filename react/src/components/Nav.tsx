import { useCallback, useState } from "react";

import {
  IconButton,
  Stack,
  Text,
  Tooltip,
  type StackProps,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { TbLogin, TbLogout, TbLoader2 } from "react-icons/tb";

import Expander from "./Expander";
import DialogLogin from "./DialogLogin";
import { useAuth, useAuthLogin, useAuthLogout } from "../cache/auth";

function Nav(props: StackProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  const login = useAuthLogin();
  const logout = useAuthLogout();

  const { data } = useAuth();
  const isKnown = data!.isKnown;
  const isAuth = data!.isAuth;

  const [isOpenDialogLogin, setOpenDialogLogin] = useState(false);
  const loginOrLogout = useCallback(() => {
    if (isAuth) logout();
    else setOpenDialogLogin(true);
  }, [isAuth]);

  const handleLogin = useCallback(
    (credentials?: { email: string; password: string }) => {
      // close dialog
      setOpenDialogLogin(false);

      // login
      // login({ email: "rstar3@abv.bg", password: "@K7@qnxwSRc4stQ" });
      if (credentials) login(credentials);
    },
    [],
  );

  return (
    <>
      <Stack flexDirection="row" h={16} px={6} alignItems="center" {...props}>
        <Text>Calendar Activities</Text>

        <Expander />

        <Tooltip label={colorMode === "light" ? "Dark mode" : "Light mode"}>
          <IconButton
            variant="ghost"
            isRound
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label="color mode"
          />
        </Tooltip>

        <Tooltip
          label={isKnown ? (isAuth ? "Logout" : "Login") : "Checking..."}
        >
          <IconButton
            variant="ghost"
            isRound
            onClick={() => loginOrLogout()}
            icon={
              isKnown ? (
                isAuth ? (
                  <TbLogout />
                ) : (
                  <TbLogin />
                )
              ) : (
                <TbLoader2 className="icon-rotate" />
              )
            }
            aria-label={isKnown ? (isAuth ? "logout" : "login") : ""}
          />
        </Tooltip>
      </Stack>

      <DialogLogin open={isOpenDialogLogin} onClose={handleLogin} />
    </>
  );
}

export default Nav;
