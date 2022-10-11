import React, { useContext } from "react";
import { AuthModalContext } from "../../../../store/AuthmodalProvider";
import {
  Button,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { useUserAuth, useSignOut } from "../../../../store/reactQueryHooks";

const UserMenu = () => {
  const { data: user, isLoading, error } = useUserAuth();
  const { mutate } = useSignOut();
  const { setModalSettings } = useContext(AuthModalContext);
  return (
    <Menu>
      <MenuButton
        as={Button}
        bgColor="white"
        borderRadius={6}
        _hover={{ outline: "1px solid", outlineColor: "gray.400" }}
        rightIcon={<ChevronDownIcon />}
      >
        {user ? (
          <Flex align="center">
            <div className="w-5 h-5 text-gray-400">
              <RedditIcon />
            </div>
            <Flex
              direction="column"
              display={{ base: "none", lg: "flex" }}
              fontSize={12}
              align="flex-start"
              ml="3"
            >
              <Text>{user?.displayName || user.email?.split("@")[0]}</Text>
              <Flex align="center">
                <div className="text-red-400 ">
                  <Icon as={Sparkles} />
                </div>

                <Text fontWeight="medium">1 Karma</Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <UserIcon />
        )}
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem _hover={{ bg: "blue.500", color: "white" }}>
              <Flex>
                <Icon as={UserIcon} />
                <Text ml="2">Profile</Text>
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              _hover={{ bg: "blue.500", color: "white" }}
              onClick={mutate}
            >
              <Flex>
                <Icon as={SignoutIcon} />
                <Text ml="2">Logout</Text>
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              _hover={{ bg: "blue.500", color: "white" }}
              onClick={() =>
                setModalSettings((prev) => ({ ...prev, open: true }))
              }
            >
              <Flex>
                <Icon as={SignoutIcon} />
                <Text ml="2">Login / Sign Up</Text>
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;

// icons

const RedditIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <g>
        <circle fill="currentColor" cx="10" cy="10" r="10"></circle>
        <path
          fill="#FFF"
          d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"
        ></path>
      </g>
    </svg>
  );
};

const UserIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};

const SignoutIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  );
};
const Sparkles = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-3 h-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
};
