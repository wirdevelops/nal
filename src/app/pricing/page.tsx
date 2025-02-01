'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Building2, 
  CalendarDays,
  Users,
  Clock,
  Zap,
  Shield,
  HelpCircle,
  Send
} from 'lucide-react';

const plans = [
  {
    name: "Indie",
    price: { monthly: 29, annual: 24 },
    description: "Perfect for independent creators",
    features: [
      { name: "Active Projects", value: "3 Projects", tooltip: "Number of projects you can work on simultaneously" },
      { name: "Storage", value: "10GB", tooltip: "Total cloud storage for your projects" },
      { name: "Team Members", value: "Up to 3", tooltip: "Number of team members you can add" },
      { name: "Support", value: "Email Support", tooltip: "Response within 24 hours" },
      { name: "Templates", value: "Basic Templates", tooltip: "Access to starter templates" }
    ],
    cta: "Start Free Trial",
    highlight: false
  },
  {
    name: "Studio",
    price: { monthly: 79, annual: 65 },
    description: "For growing production teams",
    features: [
      { name: "Active Projects", value: "Unlimited", tooltip: "No limit on active projects" },
      { name: "Storage", value: "100GB", tooltip: "Expanded cloud storage for larger projects" },
      { name: "Team Members", value: "Up to 10", tooltip: "Add up to 10 team members" },
      { name: "Support", value: "Priority Support", tooltip: "Response within 4 hours" },
      { name: "Templates", value: "Premium Templates", tooltip: "Access to all templates including premium ones" }
    ],
    cta: "Get Started",
    highlight: true
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    description: "For large organizations",
    features: [
      { name: "Active Projects", value: "Unlimited", tooltip: "No restrictions on projects" },
      { name: "Storage", value: "Unlimited", tooltip: "Unlimited cloud storage" },
      { name: "Team Members", value: "Unlimited", tooltip: "No team size limits" },
      { name: "Support", value: "24/7 Support", tooltip: "Round-the-clock dedicated support" },
      { name: "Templates", value: "Custom Templates", tooltip: "Custom-built templates for your needs" }
    ],
    cta: "Contact Sales",
    highlight: false
  }
];

const features = [
  {
    icon: Building2,
    title: "Industry Standard",
    description: "Used by top production houses worldwide"
  },
  {
    icon: CalendarDays,
    title: "14-Day Trial",
    description: "Test all features risk-free"
  },
  {
    icon: Users,
    title: "Team Ready",
    description: "Scales with your organization"
  }
];

// Comparison table data
const comparisonFeatures = {
  "Collaboration Features": {
    "Team Chat": ["Basic", "Advanced", "Enterprise"],
    "File Sharing": ["Up to 1GB", "Up to 10GB", "Unlimited"],
    "Real-time Editing": ["✓", "✓", "✓"],
    "Version History": ["30 days", "90 days", "Unlimited"]
  },
  "Support & Security": {
    "Support Level": ["Email", "Priority", "24/7 Dedicated"],
    "SLA Guarantee": ["✕", "99.9%", "99.99%"],
    "Custom Security": ["✕", "✓", "✓"],
    "SSO Integration": ["✕", "✕", "✓"]
  }
};

const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 p-6 bg-muted rounded-lg">
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

// Contact form component for enterprise dialog
const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Company</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <Send className="w-4 h-4 mr-2" />
        Send Message
      </Button>
    </form>
  );
};

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();

  const handleBillingChange = (checked: boolean) => {
    setIsAnnual(checked);
  };

  const handleFreeTrial = () => {
    // Integration with authentication/signup system would go here
    toast({
      title: "Free Trial Started",
      description: "Welcome! Your 14-day trial has begun.",
    });
  };

  const handleGetStarted = () => {
    // Integration with payment system would go here
    toast({
      title: "Redirecting to Checkout",
      description: "Please complete your payment to get started.",
    });
  };

  const handleContactSubmit = (formData) => {
    // Integration with CRM/email system would go here
    console.log('Enterprise Contact Form:', formData);
    toast({
      title: "Message Sent",
      description: "Our sales team will contact you shortly.",
    });
  };

  return (
    <div className="container py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
          <Badge variant="default">New</Badge>
          <span className="text-sm font-medium">Special launch pricing</span>
        </div>
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your production needs.
          All plans include core features.
        </p>
      </div>

      {/* Value Props */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature) => (
          <ValueCard key={feature.title} {...feature} />
        ))}
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={isAnnual ? 'text-muted-foreground' : 'font-medium'}>
          Monthly
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={handleBillingChange}
        />
        <span className={isAnnual ? 'font-medium' : 'text-muted-foreground'}>
          Annually
          <Badge variant="secondary" className="ml-2">Save 20%</Badge>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={plan.highlight ? 'border-primary shadow-lg' : ''}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </div>
                {plan.highlight && (
                  <Badge>Popular</Badge>
                )}
              </div>
              <div className="mt-4">
                {typeof plan.price[isAnnual ? 'annual' : 'monthly'] === 'number' ? (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">
                      ${plan.price[isAnnual ? 'annual' : 'monthly']}
                    </span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">Custom</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                {plan.features.map((feature) => (
                  <TooltipProvider key={feature.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm">{feature.value}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{feature.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              {plan.name === "Enterprise" ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Sales Team</DialogTitle>
                      <DialogDescription>
                        Fill out the form below and our team will get back to you within 24 hours.
                      </DialogDescription>
                    </DialogHeader>
                    <ContactForm onSubmit={handleContactSubmit} />
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  className="w-full" 
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={plan.name === "Indie" ? handleFreeTrial : handleGetStarted}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Indie</TableHead>
                  <TableHead>Studio</TableHead>
                  <TableHead>Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(comparisonFeatures).map(([category, items]) => (
                  <>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={4} className="font-medium">
                        {category}
                      </TableCell>
                    </TableRow>
                    {Object.entries(items).map(([feature, values]) => (
                      <TableRow key={feature}>
                        <TableCell className="font-medium">{feature}</TableCell>
                        {values.map((value, index) => (
                          <TableCell key={index}>
                            {value === "✓" ? (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            ) : value === "✕" ? (
                              <XCircle className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              value
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Section */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Enterprise Features</h3>
                <p className="text-primary-foreground/80">
                  Built for organizations that need advanced features, security, and support.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>24/7 Premium Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Advanced Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Custom Integrations</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="lg" className="w-full">
                      Contact Sales
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Enterprise Sales</DialogTitle>
                      <DialogDescription>
                        Get a custom quote for your organization's needs.
                      </DialogDescription>
                    </DialogHeader>
                    <ContactForm onSubmit={handleContactSubmit} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Trusted by Industry Leaders</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "The best production management platform we've used. It's transformed how we work.",
              author: "Sarah Chen",
              role: "Production Director",
              company: "Stellar Studios"
            },
            {
              quote: "Enterprise support is outstanding. They're always there when we need them.",
              author: "Michael Ross",
              role: "Technical Director",
              company: "Global Media"
            },
            {
              quote: "The collaboration features have made remote work seamless for our team.",
              author: "Jessica Lee",
              role: "Creative Director",
              company: "Digital Arts Co"
            }
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Money-back Guarantee */}
      <div className="max-w-3xl mx-auto text-center">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Shield className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">30-Day Money-Back Guarantee</h3>
              <p className="text-muted-foreground">
                Try any plan risk-free. If you're not completely satisfied within the first 30 days,
                we'll refund your payment in full — no questions asked.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-primary hover:text-primary/80 cursor-pointer">
          <HelpCircle className="w-4 h-4" />
          <Dialog>
            <DialogTrigger className="font-medium">View frequently asked questions</DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Frequently Asked Questions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I switch between plans?",
                    a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                  },
                  {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards, PayPal, and bank transfers for enterprise clients."
                  },
                  {
                    q: "Is there a free trial available?",
                    a: "Yes, we offer a 14-day free trial on all our plans. No credit card required."
                  },
                  {
                    q: "What happens after my trial ends?",
                    a: "You'll be notified before your trial ends and can choose to subscribe to continue using the service. No automatic charges."
                  }
                ].map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{faq.q}</h4>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}