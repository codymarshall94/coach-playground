"use client";

import { RichTextRenderer } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import {
  Bold,
  Eraser,
  Eye,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Pencil,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import { useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}

export const ProgramDescriptionEditor = ({
  value,
  onChange,
  label = "Program Notes",
}: Props) => {
  const [previewMode, setPreviewMode] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, CharacterCount.configure({ limit: 3000 })],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] prose dark:prose-invert focus:outline-none px-3 py-2 border border-muted rounded-md bg-background leading-relaxed tracking-tight",
        placeholder: "Start writing your program notes here...",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const charCount = editor?.storage.characterCount.characters() ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {charCount} characters
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPreviewMode((p) => !p)}
          >
            {previewMode ? (
              <Pencil className="w-4 h-4 mr-1" />
            ) : (
              <Eye className="w-4 h-4 mr-1" />
            )}
            {previewMode ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      {!previewMode && (
        <div className="flex flex-wrap gap-1 border border-muted rounded-md px-2 py-1 bg-muted/30">
          <EditorToolbarButton
            icon={<Bold className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
          />
          <EditorToolbarButton
            icon={<Italic className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
          />
          <EditorToolbarButton
            icon={<Heading2 className="w-4 h-4" />}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor?.isActive("heading", { level: 2 })}
          />
          <EditorToolbarButton
            icon={<Heading3 className="w-4 h-4" />}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor?.isActive("heading", { level: 3 })}
          />
          <EditorToolbarButton
            icon={<List className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive("bulletList")}
          />
          <EditorToolbarButton
            icon={<ListOrdered className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
          />
          <EditorToolbarButton
            icon={<Quote className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive("blockquote")}
          />
          <EditorToolbarButton
            icon={<Minus className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          />
          <EditorToolbarButton
            icon={<Eraser className="w-4 h-4" />}
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
          />
          <EditorToolbarButton
            icon={<Undo className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().undo().run()}
          />
          <EditorToolbarButton
            icon={<Redo className="w-4 h-4" />}
            onClick={() => editor?.chain().focus().redo().run()}
          />
        </div>
      )}

      {previewMode ? (
        <div className="border border-muted rounded-md p-4 bg-background">
          <RichTextRenderer html={editor?.getHTML() ?? ""} />
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}

      <p className="text-xs text-muted-foreground text-right">
        Tip: <kbd>Ctrl+B</kbd> for bold, <kbd>Ctrl+Z</kbd> to undo,{" "}
        <kbd>Cmd+K</kbd> for links (if enabled).
      </p>
    </motion.div>
  );
};

function EditorToolbarButton({
  icon,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={`w-8 h-8 p-0 ${
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      }`}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
}
