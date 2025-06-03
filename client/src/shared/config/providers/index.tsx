"use client";

import { ReactNode, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { ThemeProvider } from "next-themes";

import ProfileProvider from "./profile.provider";

const Providers = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError(error, variables, context) {
              if (error instanceof AxiosError) {
                if (error.status === 404) {
                  toast.error("Something went wrong, try again!");
                  return;
                }
                const message = error.response?.data.message
                  ? Array.isArray(error.response?.data.message)
                    ? error.response?.data.message.join(", ")
                    : error.response?.data.message
                  : "Something went wrong, try again!";
                toast.error(
                  error.response?.data.mustActivate
                    ? "You need to activate account to be able to make actions!"
                    : message,
                );
              }
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider themes={["light", "dark"]} defaultTheme="dark">
        <ProfileProvider>
          {children}
          <Toaster />
        </ProfileProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
