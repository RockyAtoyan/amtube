"use client";

import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { Button } from "@/shared/ui/button";
import Input from "@/shared/ui/input";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchInput = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("searchTerm") || "";

  const handleSubmit = (data: FormData) => {
    const text = data.get("text") as string;
    if (!text.trim()) return;
    router.push(PublicRoutes.SEARCH_VIDEO(text));
  };

  return (
    <form action={handleSubmit} className="flex items-center">
      <Input
        defaultValue={searchTerm}
        name="text"
        className="border rounded-r-none md:w-64 lg:w-96"
        label="Type to search"
      />
      <Button
        className="rounded-l-none border border-accent hover:border-accent-secondary"
        size="icon"
      >
        <SearchIcon className="text-primary/60" size={20} />
      </Button>
    </form>
  );
};

export default SearchInput;
