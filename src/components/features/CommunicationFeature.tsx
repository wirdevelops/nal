import React from 'react';
import { MessageSquare } from 'lucide-react';

const CommunicationFeature = () => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-card">
      <div className="p-4 rounded-full bg-primary-foreground text-primary mb-4">
        <MessageSquare className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">Communication</h3>
      <p className="text-center text-muted-foreground">
        Communicate via project chats, team spaces, and direct messages.
      </p>
    </div>
  );
};

export default CommunicationFeature;
