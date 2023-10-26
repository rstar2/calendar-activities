import { useCallback } from "react";

import {
  IconButton,
  Stack,
  Heading,
  Tooltip,
  type StackProps,
  useColorMode,
  useDisclosure,
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

  const {
    data: { isKnown, isAuth },
  } = useAuth();

  const {
    isOpen: isOpenDialogLogin,
    onOpen: openDialogLogin,
    onClose: closeDialogLogin,
  } = useDisclosure({ defaultIsOpen: false });

  const loginOrLogout = useCallback(() => {
    if (isAuth) logout();
    else openDialogLogin();
  }, [isAuth]);

  const handleLogin = useCallback(
    async (credentials?: { email: string; password: string }) => {
      // login
      if (credentials) await login(credentials);

      // close dialog (only if canceled or successful login)
      closeDialogLogin();
    },
    [],
  );

  return (
    <>
      <Stack flexDirection="row" h={16} px={6} alignItems="center" {...props}>
        <Heading size="md">Calendar Activities</Heading>

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
