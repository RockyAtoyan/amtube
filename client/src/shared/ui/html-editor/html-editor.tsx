"use client";

import { FC, useCallback, useEffect, useState } from "react";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { LinkIcon } from "lucide-react";
import sanitizeHtml from "sanitize-html";

import { Button } from "../button";
import Input from "../input";
import { Modal } from "../modal";

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const HtmlEditor: FC<Props> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder || "",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme,
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            const disallowedDomains: string[] = [];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onCreate(props) {
      const html = props.editor.getHTML();
      onChange?.(html === "<p></p>" ? "" : sanitizeHtml(html));
    },
    onUpdate(props) {
      const html = props.editor.getHTML();
      onChange?.(html === "<p></p>" ? "" : sanitizeHtml(html));
    },
  });

  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const previousUrl = editor?.getAttributes("link").href;
      setUrl(previousUrl || "");
    } else {
      setUrl("");
    }
  }, [isOpen]);

  const setLink = useCallback(
    (url: string) => {
      if (!url) {
        return;
      }
      if (url === "") {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();
        setIsOpen(false);
        return;
      }

      try {
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      } catch (e) {}
      setIsOpen(false);
    },
    [editor],
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          size={"icon"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </Button>
        <Button
          type="button"
          className="italic"
          size={"icon"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </Button>
        <Button
          type="button"
          size={"icon"}
          className="underline"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          U
        </Button>
        <Button
          type="button"
          size={"icon"}
          className="line-through"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          S
        </Button>
        <Modal isOpen={isOpen} onOpenChange={(value) => setIsOpen(value)}>
          <Modal.Trigger size={"icon"}>
            <LinkIcon size={16} />
          </Modal.Trigger>
          <Modal.Content>
            <Modal.Header
              title="Add a link to text."
              description="Select text and type link's url."
            />

            <div className="py-4 pt-0">
              <Input
                label="Your url"
                value={url}
                onChange={(e) => setUrl(e.currentTarget.value)}
              />
            </div>

            <Modal.Footer>
              <Modal.Close />
              <Button onClick={() => setLink(url)}>Save</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </div>
      <EditorContent editor={editor} className="max-h-96" />
    </div>
  );
};

export default HtmlEditor;
