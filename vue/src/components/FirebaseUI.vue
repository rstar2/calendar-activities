<template>
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import { EmailAuthProvider } from "firebase/auth";
import "firebaseui/dist/firebaseui.css";

export default {
  mounted() {
    const self = this;
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (/* authResult, redirectUrl */) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.

          // notify the parent that the sign-in is successful
          self.$emit("signin");

          // reset so that next component can be reused after for instance
          // show-signin/logout/show-signin
          self.$firebase.ui.reset();
          self.$firebase.ui.start("#firebaseui-auth-container", uiConfig);

          // return false if signInSuccessUrl is not defined
          return false;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
      //   signInSuccessUrl: "profile",
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // GoogleAuthProvider.PROVIDER_ID,
        // FacebookAuthProvider.PROVIDER_ID,
        // TwitterAuthProvider.PROVIDER_ID,
        // GithubAuthProvider.PROVIDER_ID,
        // EmailAuthProvider.PROVIDER_ID,
        // {
        //   provider: EmailAuthProvider.PROVIDER_ID,
        //   signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        //   // Allow the user the ability to complete sign-in cross device,
        //   // including the mobile apps specified in the ActionCodeSettings
        //   // object below.
        //   forceSameDevice: false,
        // },
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
      ],
      // Terms of service url.
      // tosUrl: "<your-tos-url>",
      // Privacy policy url.
      // privacyPolicyUrl: "<your-privacy-policy-url>",
    };

    // init the UI
    this.$firebase.ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>

<style>
/* Overwrite some Firebase-UI styles from  firebaseui/dist/firebaseui.css */
.firebaseui-container {
  max-width: unset;
}
</style>
