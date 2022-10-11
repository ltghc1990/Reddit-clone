import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";

import { AuthModalContext } from "../../../../store/AuthmodalProvider";

const AuthButton = () => {
  const { setModalSettings } = useContext(AuthModalContext);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{
          base: "none",
          sm: "flex",
        }}
        mr="2"
        onClick={() => setModalSettings({ open: true, view: "login" })}
      >
        Log In
      </Button>
      <Button
        height="28px"
        display={{
          base: "none",
          sm: "flex",
        }}
        mr="2"
        onClick={() => setModalSettings({ open: true, view: "signup" })}
      >
        Sign Up
      </Button>
    </>
  );
};

export default AuthButton;
