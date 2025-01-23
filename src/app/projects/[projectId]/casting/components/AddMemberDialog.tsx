// app/tools/casting/components/AddMemberDialog.tsx
'use client'

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogProps } from '../types';

export function AddMemberDialog({ open, onOpenChange, projectId }: DialogProps) {
return (
<Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="sm:max-w-[425px]">
<DialogHeader>
<DialogTitle>Add New Member</DialogTitle>
</DialogHeader>
<div className="grid gap-4 py-4">
<div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="name" className="text-right">
Name
</Label>
<Input
id="name"
className="col-span-3"
placeholder="Enter full name"
/>
</div>
<div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="type" className="text-right">
Type
</Label>
<Select>
<SelectTrigger className="col-span-3">
<SelectValue placeholder="Select member type" />
</SelectTrigger>
<SelectContent>
<SelectItem value="cast">Cast</SelectItem>
<SelectItem value="crew">Crew</SelectItem>
</SelectContent>
</Select>
</div>
<div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="role" className="text-right">
Role
</Label>
<Input
id="role"
className="col-span-3"
placeholder="Enter role or position"
/>
</div>
<div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="department" className="text-right">
Department
</Label>
<Select>
<SelectTrigger className="col-span-3">
<SelectValue placeholder="Select department" />
</SelectTrigger>
<SelectContent>
<SelectItem value="direction">Direction</SelectItem>
<SelectItem value="camera">Camera</SelectItem>
<SelectItem value="sound">Sound</SelectItem>
<SelectItem value="art">Art</SelectItem>
<SelectItem value="production">Production</SelectItem>
</SelectContent>
</Select>
</div>
<div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="contact" className="text-right">
Contact
</Label>
<Input
id="contact"
className="col-span-3"
placeholder="Enter contact information"
/>
</div>
<div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="notes" className="text-right">
Notes
</Label>
<Textarea
id="notes"
className="col-span-3"
placeholder="Add any additional notes"
/>
</div>
</div>
<DialogFooter>
<Button type="submit">Add Member</Button>
</DialogFooter>
</DialogContent>
</Dialog>
);
}

// import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
// Select,
// SelectContent,
// SelectItem,
// SelectTrigger,
// SelectValue,
// } from '@/components/ui/select';
// import { Calendar } from '@/components/ui/calendar';
// import { format } from 'date-fns';
// import { Calendar as CalendarIcon, Clock } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { DialogProps } from '../types';

// export function CreateAuditionDialog({ open, onOpenChange, projectId }: DialogProps) {
// const [date, setDate] = React.useState(null);

// return (
// <Dialog open={open} onOpenChange={onOpenChange}>
// <DialogContent className="sm:max-w-[525px]">
// <DialogHeader>
// <DialogTitle>Schedule Audition</DialogTitle>
// </DialogHeader>
// <div className="grid gap-4 py-4">
// <div className="grid grid-cols-4 items-center gap-4">
// <Label htmlFor="role" className="text-right">
// Role
// </Label>
// <Input
// id="role"
// className="col-span-3"
// placeholder="Enter role title"
// />
// </div>

// <div className="grid grid-cols-4 items-center gap-4">
//         <Label className="text-right">Date</Label>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className={cn(
//                 "col-span-3 justify-start text-left font-normal",
//                 !date && "text-muted-foreground"
//               )}
//             >
//               <CalendarIcon className="mr-2 h-4 w-4" />
//               {date ? format(date, "PPP") : <span>Pick a date</span>}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar
//               mode="single"
//               selected={date}
//               onSelect={setDate}
//               initialFocus
//             />
//           </PopoverContent>
//         </Popover>
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="time" className="text-right">
//           Time Slots
//         </Label>
//         <div className="col-span-3 space-y-2">
//           <div className="flex items-center gap-2">
//             <Clock className="h-4 w-4 text-muted-foreground" />
//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Start Time" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="9:00">9:00 AM</SelectItem>
//                 <SelectItem value="10:00">10:00 AM</SelectItem>
//                 <SelectItem value="11:00">11:00 AM</SelectItem>
//                 {/* Add more time slots */}
//               </SelectContent>
//             </Select>
//             <span>to</span>
//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="End Time" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="17:00">5:00 PM</SelectItem>
//                 <SelectItem value="18:00">6:00 PM</SelectItem>
//                 <SelectItem value="19:00">7:00 PM</SelectItem>
//                 {/* Add more time slots */}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="location" className="text-right">
//           Location
//         </Label>
//         <Input
//           id="location"
//           className="col-span-3"
//           placeholder="Enter audition location"
//         />
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="slots" className="text-right">
//           Slot Duration
//         </Label>
//         <Select>
//           <SelectTrigger className="col-span-3">
//             <SelectValue placeholder="Select time per audition" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="15">15 minutes</SelectItem>
//             <SelectItem value="30">30 minutes</SelectItem>
//             <SelectItem value="45">45 minutes</SelectItem>
//             <SelectItem value="60">1 hour</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="requirements" className="text-right">
//           Requirements
//         </Label>
//         <Textarea
//           id="requirements"
//           className="col-span-3"
//           placeholder="Enter audition requirements and notes"
//         />
//       </div>
//     </div>
//     <DialogFooter>
//       <Button variant="outline" onClick={() => onOpenChange(false)}>
//         Cancel
//       </Button>
//       <Button type="submit">Schedule Audition</Button>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
// );
// }