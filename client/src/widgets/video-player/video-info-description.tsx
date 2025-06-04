import { cn } from "@/shared/lib";

import { useState } from "react";

const VideoInfoDescription = ({ description }: { description: string }) => {
  const [isMore, setIsMore] = useState(false);

  return (
    <div className="mt-4 py-2 px-4 bg-secondary rounded-lg">
      <p
        className={cn(isMore ? "line-clamp-none" : "line-clamp-2")}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <span
        className="user-select-none block mt-5 cursor-pointer text-sm"
        onClick={() => {
          setIsMore((prev) => !prev);
        }}
      >
        {isMore ? "Hide" : "...more"}
      </span>
    </div>
  );
};

export default VideoInfoDescription;
