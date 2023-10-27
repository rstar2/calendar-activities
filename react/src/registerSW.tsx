import { registerSW } from "virtual:pwa-register";
// its type-definitions are added in vite-env.d.ts

import { createStandaloneToast, Button, Text, Stack } from "@chakra-ui/react";

const updateSW = registerSW({
  onRegisteredSW() {
    console.log("onRegisteredSW");
  },

  onOfflineReady() {
    console.log("onOfflineReady");
  },

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
