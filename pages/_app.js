import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Layout } from "../components/Layout/Layout";
import AuthModalProvider from "../store/AuthmodalProvider";

// take extended theme and give it to the chakra provider
import { theme } from "../chakra/theme";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthModalProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
            <ReactQueryDevtools />
          </Layout>
        </ChakraProvider>
      </AuthModalProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
