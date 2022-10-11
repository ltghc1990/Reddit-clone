import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import { useUserAuth } from "../../../store/reactQueryHooks";

// auth is needed only for styling purposes, If no user, the searchbar has a maxW imposed on it

const SearchInput = () => {
  const { data: user } = useUserAuth();
  return (
    <InputGroup maxW={user ? "auto" : "600px"} mx="2">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>

      <Input
        type="search"
        fontSize={"small"}
        placeholder="Search Reddit"
        bg="gray.50"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
    </InputGroup>
  );
};

export default SearchInput;
