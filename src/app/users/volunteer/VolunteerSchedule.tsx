'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, addHours } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface Shift {
  id: string;
  start: Date;
  end: Date;
  role: string;
  volunteers: string[];
  status: 'draft' | 'published' | 'completed';
}

export function VolunteerShiftManager({ }: { projectId: string }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [open, setOpen] = useState(false);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    start: new Date(),
    end: addHours(new Date(), 2),
    role: 'General Volunteer',
    status: 'draft'
  });

  const handleCreateShift = () => {
    setShifts([...shifts, {
      ...newShift as Shift,
      id: `shift-${Date.now()}`,
      volunteers: []
    }]);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Shift Management</h3>
        <Button onClick={() => setOpen(true)}>New Shift</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shifts.map(shift => (
          <div key={shift.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{format(shift.start, 'MMM dd, yyyy')}</p>
                <p className="text-sm text-muted-foreground">
                  {format(shift.start, 'HH:mm')} - {format(shift.end, 'HH:mm')}
                </p>
              </div>
              <Badge variant={shift.status === 'published' ? 'default' : 'secondary'}>
                {shift.status}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm">Role: {shift.role}</p>
              <p className="text-sm">Volunteers: {shift.volunteers.length}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Shift</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newShift.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newShift.start ? format(newShift.start, "PPP HH:mm") : <span>Pick start time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newShift.start}
                      onSelect={(date) => setNewShift({ ...newShift, start: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newShift.end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newShift.end ? format(newShift.end, "PPP HH:mm") : <span>Pick end time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newShift.end}
                      onSelect={(date) => setNewShift({ ...newShift, end: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input 
                value={newShift.role}
                onChange={(e) => setNewShift({ ...newShift, role: e.target.value })}
              />
            </div>
            <Button onClick={handleCreateShift}>Create Shift</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}