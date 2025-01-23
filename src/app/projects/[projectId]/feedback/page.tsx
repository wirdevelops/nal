'use client';

import { FeedbackView } from '@/app/projects/components/FeedbackView';

export default function FeedbackPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Feedback & Review</h2>
        <p className="text-muted-foreground">
          Upload images and provide visual feedback with annotations
        </p>
      </div>

      <FeedbackView projectId={params.projectId} />
    </div>
  );
}