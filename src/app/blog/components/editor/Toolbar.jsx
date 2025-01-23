"use client";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";

const EditorToolbar = ({ editor, onImageUpload }) => {
  if (!editor) {
      return null;
  }

  const handleToggle = useCallback((mark) => {
    editor.chain().focus().toggleMark(mark).run()
  }, [editor])

  const handleBlock = useCallback((block) => {
    editor.chain().focus().toggleNode(block).run()
  }, [editor])

  return (
    <div className="flex space-x-2 mb-2">
      <Button onClick={() => handleToggle('bold')} disabled={!editor.can().toggleMark('bold')} size="sm">
        Bold
      </Button>
      <Button onClick={() => handleToggle('italic')} disabled={!editor.can().toggleMark('italic')} size="sm">
        Italic
      </Button>
      <Button onClick={() => handleBlock('bulletList')} disabled={!editor.can().toggleNode('bulletList')} size="sm">
        List
      </Button>
      <Button onClick={() => handleBlock('codeBlock')} disabled={!editor.can().toggleNode('codeBlock')} size="sm">
        Code
      </Button>
      <Button onClick={onImageUpload} size="sm">
          Image
      </Button>
      {/* Add more toolbar buttons for other formatting options */}
    </div>
  );
};

export default EditorToolbar;