import Input from "@/shared/ui/input";

import { FC, useState } from "react";

import { X } from "lucide-react";

interface Props {
  tags: string[];
  setTags: (tags: string[]) => void;
}
const UploadVideoTagsInput: FC<Props> = ({ tags, setTags }) => {
  const [tagInput, setTagInput] = useState("");

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (tags.find((tag) => tag === tagInput.trim())) return;
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 px-2 py-1 bg-accent/10 border border-accent/20 rounded-md text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </span>
      ))}
      <Input
        label="Tags..."
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagInputKeyDown}
        labelClassName="bg-secondary"
      />
    </div>
  );
};

export default UploadVideoTagsInput;
