import { useCallback, useState } from "react";

import {
  IconButton,
  Stack,
  Heading,
  type StackProps,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  TbLogin,
  TbLogout,
  TbLoader2,
  TbBrandGoogle,
  TbActivity,
} from "react-icons/tb";

import TooltipMobile from "./TooltipMobile";
import Expander from "./Expander";
import DialogLogin from "./DialogLogin";
import DialogActivityAddOrEdit from "./DialogActivityAddOrEdit";
import {
  useAuth,
  useAuthLogin,
  useAuthLoginWithGoogle,
  useAuthLogout,
} from "../cache/auth";
import { useActivityAdd } from "../cache/activities";
import { Activity } from "../types/Activity";

function Nav(props: StackProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  const login = useAuthLogin();
  const loginWithGoogle = useAuthLoginWithGoogle();
  const logout = useAuthLogout();

  const {
    data: { isKnown, isAuth },
  } = useAuth();

  const {
    isOpen: isOpenDialogLogin,
    onOpen: openDialogLogin,
    onClose: closeDialogLogin,
  } = useDisclosure({ defaultIsOpen: false });

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [activityAdd, isAddPending] = useActivityAdd();

  const loginOrLogout = useCallback(() => {
    if (isAuth) logout();
    else openDialogLogin();
  }, [isAuth, logout, openDialogLogin]);

  const handleLogin = useCallback(
    async (credentials?: { email: string; password: string }) => {
      // login
      if (credentials) await login(credentials);

      // close dialog (only if canceled or successful login)
      closeDialogLogin();
    },
    [login, closeDialogLogin],
  );

  const handleActivityCreate = useCallback(
    async (activity?: Partial<Activity>) => {
      if (activity) await activityAdd(activity);
      setAddDialogOpen(false);
    },
    [setAddDialogOpen, activityAdd],
  );

  return (
    <>
      <Stack flexDirection="row" h={16} px={6} alignItems="center" {...props}>
        <Heading size="md">Calendar Activities</Heading>

        <Expander />

        <TooltipMobile
          label={colorMode === "light" ? "Dark mode" : "Light mode"}
        >
          <IconButton
            variant="ghost"
            isRound
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label="color mode"
          />
        </TooltipMobile>

        <TooltipMobile
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
        </TooltipMobile>

        {isAuth && (
          <TooltipMobile label="Add activity">
            <IconButton
              variant="ghost"
              isRound
              onClick={() => setAddDialogOpen(true)}
              icon={<TbActivity />}
              aria-label="add activity"
            />
          </TooltipMobile>
        )}

        {isKnown && !isAuth && (
          <IconButton
            variant="ghost"
            isRound
            onClick={() => loginWithGoogle()}
            icon={<TbBrandGoogle />}
            aria-label="login with Google"
          />
        )}
      </Stack>

      <DialogLogin open={isOpenDialogLogin} onClose={handleLogin} />

      <DialogActivityAddOrEdit
        open={isAddDialogOpen}
        disabled={isAddPending}
        onClose={handleActivityCreate}
      />
    </>
  );
}

export default Nav;
