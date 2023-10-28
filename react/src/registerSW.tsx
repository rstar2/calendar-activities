import { registerSW } from "virtual:pwa-register";
// its type-definitions are added in vite-env.d.ts

import { createStandaloneToast, Button, Text, Stack } from "@chakra-ui/react";

import configPush from "./configurePushNotifications.ts";

const updateSW = registerSW({
  onRegisteredSW(_swScriptUrl, swReg) {
    console.log("onRegisteredSW");

    // try to configure the PushNotifications
    configPush(swReg);
  },

  onOfflineReady() {
    console.log("onOfflineReady");
  },

  /**
   * Callback called when new version of the app is ready/available.
   * Here we could show a special UI so user could decide whether to immediately switch to it,
   * (e.g. this means to make let the new SW take control).
   * When all browser windows/tabs with the app a closed
   * and then opened again the new version will take control anyway,
   * so this here is to make the user decide to do it immediately.
   */
  onNeedRefresh() {
    console.log("onNeedRefresh");
    const { toast } = createStandaloneToast();
    const toastId = toast({
      title: "New version is ready",
      description: (
        <Stack direction="row" alignItems="center">
          <Text>Click OK to refresh</Text>
          <Button
            variant="solid"
            onClick={() => {
              toast.close(toastId);

              // this will trigger the refresh and make the new SW take control
              updateSW();
            }}
          >
            OK
          </Button>
        </Stack>
      ),
      status: "info",
      duration: 10000,
      isClosable: true,
      position: "bottom-right",
    });
  },
});
