"use client";
import React, { useMemo, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from "lowlight";
import EditorToolbar from "./EditorToolbar";

const lowlight = createLowlight(common);

const Editor = ({ content = "", onUpdate, placeholder="Write your blog post here..." }) => {
  const [imageDialog, setImageDialog] = useState(false)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
          allowBase64: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      })
    ],
    content,
    onUpdate({ editor }) {
      onUpdate(editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(() => {
    setImageDialog(true)
  },[])

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col">
         <EditorToolbar editor={editor} onImageUpload={handleImageUpload}/>
        <div className="border rounded-md p-2 focus-within:ring-2 focus-within:ring-primary">
           <EditorContent editor={editor} />
        </div>
    </div>
  );
};

export default Editor;