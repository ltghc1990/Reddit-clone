import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Layout } from "../components/Layout/Layout";
import AuthModalProvider from "../store/AuthmodalProvider";
import OpenCommunityMenuP from "../store/OpenCommunityMenuP";

import { useRouter } from "next/router";

// take extended theme and give it to the chakra provider
import { theme } from "../chakra/theme";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthModalProvider>
        <ChakraProvider theme={theme}>
          <OpenCommunityMenuP>
            <Layout key={router.asPath}>
              <Component {...pageProps} />
              <ReactQueryDevtools />
            </Layout>
          </OpenCommunityMenuP>
        </ChakraProvider>
      </AuthModalProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
