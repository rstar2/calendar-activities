import React, { useCallback } from "react";
import { useSetState } from "react-use";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { z } from "zod";

const emailSchema = z.string().email({ message: "Must be valid email" });
const passwordSpecialSymbols = "^$*.[]{}()?\"!@#%&/,><':;|_~`".split("");
const passwordSchema = z
  .string()
  .min(5, { message: "Must be 5 or more characters long" })
  .max(20, { message: "Must be less than 20 characters long" })
  .refine(
    (val) => {
      return passwordSpecialSymbols.some((specialChar) =>
        val.includes(specialChar),
      );
    },
    {
      message: "Must contain special characters",
    },
  );

const safeParse = (schema: z.Schema, str: string): string => {
  const result = schema.safeParse(str);
  if (result.success) return "";

  // return the first error message
  return result.error.errors[0].message;
};

type DialogLoginProps = {
  open: boolean;
  onClose: (value?: { email: string; password: string }) => void;
};

function DialogLogin({ open, onClose }: DialogLoginProps) {
  const [localState, setLocalState] = useSetState({
    email: "",
    emailValidError: "",
    password: "",
    passwordValidError: "",
    isShowPassword: false,
  });

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const email = e.target.value;
      setLocalState({
        email,
        emailValidError: safeParse(emailSchema, email),
      });
    }, []);

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const password = e.target.value;
      setLocalState({
        password,
        passwordValidError: safeParse(passwordSchema, password),
      });
    }, []);

  const handleClose = () => {
    onClose();
  };

  const handleOk = () => {
    onClose({ email: localState.email, password: localState.password });
  };

  return (
    <Modal onClose={onClose} isOpen={open}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl isRequired isInvalid={!!localState.emailValidError}>
            <FormLabel>Email</FormLabel>
            <Input placeholder="Email" onChange={handleEmailChange} />
            <FormErrorMessage>{localState.emailValidError}</FormErrorMessage>
          </FormControl>

          <FormControl
            mt={6}
            isRequired
            isInvalid={!!localState.passwordValidError}
          >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Password"
                onChange={handlePasswordChange}
                type={localState.isShowPassword ? "input" : "password"}
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  icon={
                    localState.isShowPassword ? <ViewOffIcon /> : <ViewIcon />
                  }
                  aria-label="Password visibility"
                  onClick={() =>
                    setLocalState({
                      isShowPassword: !localState.isShowPassword,
                    })
                  }
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{localState.passwordValidError}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={handleOk}
            ml={6}
            variant="solid"
            disabled={
              !!localState.emailValidError || !!localState.passwordValidError
            }
          >
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DialogLogin;
