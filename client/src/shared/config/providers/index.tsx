"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "next-themes";

import ProfileProvider from "./profile.provider";

const Providers = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [queryClient] = useState(() => new QueryClient());

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
