import { useState, useEffect } from "react";

type Auth = [
  boolean, // isAuth
  () => void, // login()
  () => void // logout()
];

/**
 *
 * @returns latest users reactive
 */
export default function useAuth(): Auth {
  const [auth, setAuth] = useState(false);

  function login() {
    // TODO: call login
    setAuth(true);
  }

  function logout() {
    // TODO: call logout
    setAuth(false);
  }

  useEffect(() => {
    // TODO: subscribe to changes

    return () => {
      // TODO: unsubscribe
    };
  }, []);

  return [auth, login, logout];
}
