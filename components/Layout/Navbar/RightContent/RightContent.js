import React from "react";
import { Flex, Text, Button, HStack } from "@chakra-ui/react";

import AuthButtons from "./AuthButtons";
import AuthModal from "../../../Modal/Auth/AuthModal";
import Icons from "./Icons";
import { useUserAuth, useSignOut } from "../../../../store/reactQueryHooks";
import UserMenu from "./UserMenu";

const RightContent = () => {
  const { data: user, isLoading, error } = useUserAuth();

  return (
    <HStack>
      <AuthModal />
      {user ? <Icons /> : <AuthButtons />}
      <UserMenu />
    </HStack>
  );
};

export default RightContent;
