import { ComponentStyleConfig } from "@chakra-ui/theme";
// here we can compose a Button component and import it into our theme.js

// currently not aplying the styles to the global components

export const Button = {
  baseStyle: {
    borderRadius: "60px",
    color: "brand.500",
    border: "2px solid red",
  },
};
