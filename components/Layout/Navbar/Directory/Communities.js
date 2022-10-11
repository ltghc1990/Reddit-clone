import { Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";

// need to bring up community modal
import CreateCommunityModal from "../../../Modal/CreateCommunity/CreateCommunityModal";

const Communities = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem onClick={() => setOpen(true)}>
        <Icon as={AddIcon} mr="2" />
        <Text fontSize={14}>Create Community</Text>
      </MenuItem>
    </>
  );
};

export default Communities;
