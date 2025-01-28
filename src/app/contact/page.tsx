import { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { QuickContactOptions } from './QuickContact';
import { FAQCTA } from './FAQ';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';

// export const metadata: Metadata = {
//   title: 'Contact Us | Nalevel Empire',
//   description: 'Get in touch with our team for any inquiries or support.'
// };

const officeLocations = [
  {
    city: "Los Angeles",
    address: "555 Production Blvd, Los Angeles, CA 90028",
    phone: "+1 (323) 555-0123",
    email: "la@nalevelempire.com",
    hours: "9:00 AM - 6:00 PM PST",
    timezone: "PST"
  },
  {
    city: "London",
    address: "123 Creative St, London, UK EC1A 1BB",
    phone: "+44 20 7123 4567",
    email: "london@nalevelempire.com",
    hours: "9:00 AM - 6:00 PM GMT",
    timezone: "GMT"
  },
  {
    city: "Singapore",
    address: "88 Media Circle, Singapore 138632",
    phone: "+65 6789 0123",
    email: "singapore@nalevelempire.com",
    hours: "9:00 AM - 6:00 PM SGT",
    timezone: "SGT"
  }
];

export default function ContactPage() {
  return (
    <div className="container py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          Get in Touch
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions? We're here to help and would love to hear from you.
        </p>
      </div>

      {/* Quick Contact Options */}
      <QuickContactOptions />

      {/* Contact Form and Office Locations */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Our Offices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {officeLocations.map((office) => (
                  <div key={office.city} className="space-y-3 pb-4 border-b last:border-0">
                    <h3 className="font-semibold">{office.city}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{office.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{office.hours} ({office.timezone})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ CTA */}
      <FAQCTA />
    </div>
  );
}

// 'use client'

// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { 
//   MessageSquare, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Clock,
//   Send,
//   Loader2,
//   Building,
//   Users,
//   Calendar
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const departments = [
//   { id: 'general', label: 'General Inquiries', icon: MessageSquare },
//   { id: 'business', label: 'Business Development', icon: Users },
//   { id: 'support', label: 'Technical Support', icon: Users },
//   { id: 'press', label: 'Press & Media', icon: Building }
// ];

// const officeLocations = [
//   {
//     city: 'Los Angeles',
//     address: '123 Entertainment Blvd, Suite 100',
//     phone: '+1 (323) 555-0123',
//     email: 'la@example.com',
//     hours: '9:00 AM - 6:00 PM PST'
//   },
//   {
//     city: 'London',
//     address: '45 Media Lane, Soho',
//     phone: '+44 20 7123 4567',
//     email: 'london@example.com',
//     hours: '9:00 AM - 6:00 PM GMT'
//   }
// ];

// export default function ContactPage() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedOffice, setSelectedOffice] = useState(officeLocations[0]);
//   const [showWhatsApp, setShowWhatsApp] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//     department: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setIsSubmitting(false);
//     setFormData({
//       name: '',
//       email: '',
//       subject: '',
//       message: '',
//       department: ''
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background py-12">
//       <div className="container mx-auto px-4">
//         <div className="space-y-12">
//           {/* Hero Section */}
//           <div className="text-center space-y-4">
//             <h1 className="text-4xl font-bold">Get in Touch</h1>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Have a question or want to collaborate? We'd love to hear from you.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8">
//             {/* Contact Form */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Send us a Message</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div>
//                     <label className="block mb-2">Department</label>
//                     <Select 
//                       value={formData.department}
//                       onValueChange={(value) => setFormData({...formData, department: value})}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select department" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {departments.map(dept => (
//                           <SelectItem key={dept.id} value={dept.id}>
//                             <div className="flex items-center gap-2">
//                               <dept.icon className="w-4 h-4" />
//                               {dept.label}
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block mb-2">Name</label>
//                       <Input 
//                         placeholder="Your name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({...formData, name: e.target.value})}
//                       />
//                     </div>

//                     <div>
//                       <label className="block mb-2">Email</label>
//                       <Input 
//                         placeholder="your@email.com"
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({...formData, email: e.target.value})}
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block mb-2">Subject</label>
//                     <Input 
//                       placeholder="How can we help?"
//                       value={formData.subject}
//                       onChange={(e) => setFormData({...formData, subject: e.target.value})}
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-2">Message</label>
//                     <Textarea 
//                       placeholder="Tell us more about your inquiry..."
//                       className="min-h-32"
//                       value={formData.message}
//                       onChange={(e) => setFormData({...formData, message: e.target.value})}
//                     />
//                   </div>

//                   <div className="flex gap-4">
//                     <Button type="submit" disabled={isSubmitting} className="flex-1">
//                       {isSubmitting ? (
//                         <>
//                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Send className="w-4 h-4 mr-2" />
//                           Send Message
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Office Locations */}
//             <div className="space-y-6">
//               <Tabs defaultValue={selectedOffice.city.toLowerCase()} className="w-full">
//                 <TabsList className="w-full">
//                   {officeLocations.map(office => (
//                     <TabsTrigger
//                       key={office.city}
//                       value={office.city.toLowerCase()}
//                       onClick={() => setSelectedOffice(office)}
//                       className="flex-1"
//                     >
//                       {office.city}
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>

//                 <TabsContent value={selectedOffice.city.toLowerCase()}>
//                   <Card>
//                     <CardContent className="p-6">
//                       <div className="space-y-6">
//                         <div className="flex items-start gap-4">
//                           <MapPin className="w-5 h-5 mt-1" />
//                           <div>
//                             <h3 className="font-medium">{selectedOffice.address}</h3>
//                             <p className="text-sm text-muted-foreground">
//                               {selectedOffice.city}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                           <Phone className="w-5 h-5" />
//                           <a href={`tel:${selectedOffice.phone}`}>
//                             {selectedOffice.phone}
//                           </a>
//                         </div>

//                         <div className="flex items-center gap-4">
//                           <Mail className="w-5 h-5" />
//                           <a href={`mailto:${selectedOffice.email}`}>
//                             {selectedOffice.email}
//                           </a>
//                         </div>

//                         <div className="flex items-center gap-4">
//                           <Clock className="w-5 h-5" />
//                           <span>{selectedOffice.hours}</span>
//                         </div>

//                         <div className="pt-4">
//                           <Button className="w-full" variant="outline">
//                             <Calendar className="w-4 h-4 mr-2" />
//                             Schedule a Meeting
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>

//               <Alert>
//                 <MessageSquare className="h-4 w-4" />
//                 <AlertTitle>Live Chat Available</AlertTitle>
//                 <AlertDescription>
//                   Our team is online and ready to assist you during business hours.
//                 </AlertDescription>
//               </Alert>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }