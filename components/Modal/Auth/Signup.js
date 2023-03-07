import { Flex, Input, Text, Button } from "@chakra-ui/react";
import React, { useContext, useState } from "react";

import { AuthModalContext } from "../../../store/ AuthModalProvider";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

// function
import { useCreateUserWithEmail } from "../../../store/reactQueryHooks";

const Signup = () => {
  const { setModalSettings } = useContext(AuthModalContext);

  const { data, isLoading, error, mutate } = useCreateUserWithEmail();

  const [formError, setFormError] = useState();

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formError) setFormError("");

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    mutate(signUpForm);
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
          setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value })
        }
      />
      <Input
        required
        name="password"
        placeholder="password"
        type="password"
        mb={2}
        onChange={(e) =>
          setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value })
        }
      />
      <Input
        required
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        mb={2}
        onChange={(e) =>
          setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value })
        }
      />

      <Text textAlign={"center"} color="red.600" mb="2">
        {formError || FIREBASE_ERRORS[error?.message]}
      </Text>

      <Button mb="2" type="submit" width="100%" isLoading={isLoading}>
        Sign Up
      </Button>
      <Flex>
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setModalSettings((prev) => ({ ...prev, view: "login" }))
          }
        >
          Log In
        </Text>
      </Flex>
    </form>
  );
};

export default Signup;
