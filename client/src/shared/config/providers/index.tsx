"use client";

import { ReactNode, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "next-themes";

const Providers = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider themes={["light", "dark"]} defaultTheme="dark">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
