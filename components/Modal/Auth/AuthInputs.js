import { Flex } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthModalContext } from "../../../store/ AuthModalProvider";

import Login from "./Login";
import Signup from "./Signup";

const AuthInputs = () => {
  const { modalSettings } = useContext(AuthModalContext);
  return (
    <Flex direction={"column"}>
      {modalSettings.view === "login" && <Login />}
      {modalSettings.view === "signup" && <Signup />}
    </Flex>
  );
};

export default AuthInputs;
