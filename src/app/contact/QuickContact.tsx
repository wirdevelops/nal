'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  MessageSquare,
  Calendar,
  Globe2,
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react';

export function QuickContactOptions() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = "+1234567890";
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Instant Chat</h3>
          <p className="text-muted-foreground mb-4">Get immediate assistance through WhatsApp</p>
          <Button onClick={handleWhatsAppClick} className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat on WhatsApp
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Schedule a Call</h3>
          <p className="text-muted-foreground mb-4">Book a meeting with our team</p>
          <Button variant="outline" className="w-full">
            Book Appointment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
            <Globe2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Global Support</h3>
          <p className="text-muted-foreground mb-4">24/7 support across all time zones</p>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>support@nalevelempire.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>+1 (888) 555-0123</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}