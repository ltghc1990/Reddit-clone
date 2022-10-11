import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState, useContext } from "react";

import { FIREBASE_ERRORS } from "../../../firebase/errors";

import { AuthModalContext } from "../../../store/AuthmodalProvider";

import { useSignInWithUser } from "../../../store/reactQueryHooks";

const Login = () => {
  const { setModalSettings } = useContext(AuthModalContext);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // function to login with user/pw
  const { data, isLoading, error, mutate } = useSignInWithUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ ...loginForm });
    console.log(FIREBASE_ERRORS[error?.message]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={(e) =>
          setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
        }
      />
      <Input
        required
        name="password"
        placeholder="password"
        type="password"
        mb={2}
        onChange={(e) =>
          setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
        }
      />
      <Text my={1} color="red" textAlign={"center"} fontSize="sm">
        {FIREBASE_ERRORS[error?.message]}
      </Text>
      <Button type="submit" width="100%" isLoading={isLoading}>
        Log In
      </Button>
      <Text textAlign={"center"} my="2">
        Forget your password?
        <Text
          as={"span"}
          color="blue.500"
          cursor={"pointer"}
          ml="2"
          onClick={() =>
            setModalSettings((prev) => ({ ...prev, view: "resetPassword" }))
          }
        >
          Reset
        </Text>
      </Text>

      <Flex justify={"center"}>
        <Text mr={1}>New Here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setModalSettings((prev) => ({ ...prev, view: "signup" }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
