import SearchNav from "@/widgets/search-nav/search-nav";

import { ReactNode } from "react";

import { Search } from "lucide-react";

export default async function SearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-xl mb-8 flex items-center gap-3">
        <Search className="text-accent" size={24} /> Search result
      </p>
      <SearchNav />
      <div className="mt-3">{children}</div>
    </div>
  );
}
