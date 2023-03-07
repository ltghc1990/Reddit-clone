import React, { useState, useContext } from "react";
import { Text, Input, Button, Flex } from "@chakra-ui/react";
import RedditFace from "../../Layout/Navbar/RedditFace";

// function
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";

import { AuthModalContext } from "../../../store/ AuthModalProvider";

const ResetPassword = () => {
  const { setModalSettings } = useContext(AuthModalContext);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    await sendPasswordResetEmail(auth, email);
    setSuccess(true);
  };

  return (
    <div className="w-[85%] mx-auto text-center">
      <div className="flex justify-center mb-4">
        <RedditFace />
      </div>

      <Text fontWeight={"bold"}>Reset Your password</Text>

      {success ? (
        <Text>Check your email :{`)`}</Text>
      ) : (
        <>
          <Text>
            Enter the email associated with your account and we&apos;ll send you
            a reset link
          </Text>
          <form onSubmit={onSubmitHandler}>
            <Input
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="onSubmit" my="2">
              Reset Password
            </Button>
          </form>
        </>
      )}

      <Flex justify="center">
        <Text
          mr="2"
          color="blue.500"
          fontWeight=" bold"
          cursor="pointer"
          onClick={() =>
            setModalSettings((prev) => ({ ...prev, view: "login" }))
          }
        >
          LOGIN
        </Text>
        <Text
          color="blue.500"
          fontWeight=" bold"
          cursor="pointer"
          onClick={() =>
            setModalSettings((prev) => ({ ...prev, view: "signup" }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </div>
  );
};

export default ResetPassword;
