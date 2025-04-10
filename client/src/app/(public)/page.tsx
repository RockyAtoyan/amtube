"use client";

import HtmlEditor from "@/shared/ui/html-editor/html-editor";

// import dynamic from "next/dynamic";

// const HtmlEditor = dynamic(() => import("@/shared/ui/html-editor"), {
//   ssr: false,
// });

export default function Home() {
  return (
    <div>
      <HtmlEditor />
    </div>
  );
}
