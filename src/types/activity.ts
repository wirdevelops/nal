export interface Activity {
    id: string;
    type: 'update' | 'comment' | 'file' | 'status' | 'task' | 'team';
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    timestamp: string;
    content: string;
    metadata?: {
      status?: string;
      fileName?: string;
      fileType?: string;
      taskName?: string;
      memberName?: string;
      role?: string;
    };
  }
  