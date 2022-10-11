// im asumming this imports all weight sizes
// import "@fontsource/open-sans";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

//   Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3c00",
    },
  },
  fonts: {
    body: "Open sans, sans-serif",
  },
  // global overide
  // We want to overide the body bg color
  styles: {
    global: () => ({
      body: {
        bg: "gray.200",
      },
      component: {
        Button,
      },
    }),
  },
});
