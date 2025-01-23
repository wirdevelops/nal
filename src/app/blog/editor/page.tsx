"use client";
import Editor from '../components/editor/Editor';
import { useState } from 'react';
import ImageUploadDialog from '../components/editor/ImageUploadDialog';

const BlogEditorPage = () => {
    const [postContent, setPostContent] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleContentUpdate = (content) => {
        setPostContent(content);
    };

    const handleOpenDialog = () => {
      setDialogOpen(true);
    }

    const handleCloseDialog = () => {
      setDialogOpen(false);
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Create a New Blog Post</h1>
            <Editor content={postContent} onUpdate={handleContentUpdate} placeholder="Write your blog here..." />
            <ImageUploadDialog open={dialogOpen} onClose={handleCloseDialog} editor/>
           {/* You would implement a save functionality here that get the content from the state */}
        </div>
    );
};

export default BlogEditorPage;