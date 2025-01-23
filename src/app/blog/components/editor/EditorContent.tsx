import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export function EditorContentComponent() {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: "<p>Start writing your blog post...</p>",
  });

  return <EditorContent editor={editor} className="prose dark:prose-invert p-4" />;
}