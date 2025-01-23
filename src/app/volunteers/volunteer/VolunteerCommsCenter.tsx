'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export function VolunteerCommsCenter({ volunteerIds }: { volunteerIds: string[] }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [includeEmail, setIncludeEmail] = useState(true);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Send Message
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Communication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <p className="text-sm text-muted-foreground">
                {volunteerIds.length} selected volunteers
              </p>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                rows={5}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="include-email" 
                checked={includeEmail}
                onCheckedChange={setIncludeEmail}
              />
              <Label htmlFor="include-email">Send via email</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              // Implement send logic
              setOpen(false);
            }}>
              Send Communication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}