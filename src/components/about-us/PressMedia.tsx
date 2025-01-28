import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, ArrowUpRight, Calendar, Award, ExternalLink,
  NewspaperIcon, TrendingUp, Globe2, PlayCircle, FileText,
  Image as ImageIcon, Video, Newspaper, Mail, Phone,
  Users
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pressReleases = [
  {
    title: "Nalevel Empire Launches Revolutionary AI-Powered Production Platform",
    description: "Transforming content creation with cutting-edge artificial intelligence",
    date: "January 15, 2025",
    category: "Technology",
    impact: "Industry First",
    link: "#",
    content: "Full press release content...",
    coverImage: "/api/placeholder/800/400",
    stats: {
      views: "25K+",
      shares: "12K+"
    }
  },
  {
    title: "Global Streaming Partnership Expands Creative Possibilities",
    description: "Strategic alliance brings innovative content to worldwide audiences",
    date: "December 20, 2024",
    category: "Business",
    impact: "Market Leader",
    link: "#",
    content: "Full press release content...",
    coverImage: "/api/placeholder/800/400",
    stats: {
      views: "18K+",
      shares: "8K+"
    }
  },
  {
    title: "Record-Breaking Success for Latest Original Series",
    description: "Groundbreaking storytelling reaches new heights of audience engagement",
    date: "December 5, 2024",
    category: "Entertainment",
    impact: "Audience Success",
    link: "#",
    content: "Full press release content...",
    coverImage: "/api/placeholder/800/400",
    stats: {
      views: "30K+",
      shares: "15K+"
    }
  }
];

const mediaResources = {
  brandAssets: [
    {
      title: "Logo Package",
      description: "Primary and secondary logos in various formats",
      formats: ["AI", "SVG", "PNG", "EPS"],
      size: "15MB",
      lastUpdated: "January 2025"
    },
    {
      title: "Brand Guidelines",
      description: "Complete visual identity and usage guidelines",
      formats: ["PDF"],
      size: "8MB",
      lastUpdated: "January 2025"
    },
    {
      title: "Color Palette",
      description: "Official color codes and usage examples",
      formats: ["PDF", "ASE"],
      size: "2MB",
      lastUpdated: "January 2025"
    }
  ],
  mediaKit: [
    {
      title: "Company Overview",
      description: "Comprehensive company information and history",
      formats: ["PDF", "DOCX"],
      size: "12MB",
      lastUpdated: "January 2025"
    },
    {
      title: "Executive Biographies",
      description: "Leadership team profiles and headshots",
      formats: ["PDF", "ZIP"],
      size: "25MB",
      lastUpdated: "January 2025"
    },
    {
      title: "Fact Sheet",
      description: "Key statistics and company milestones",
      formats: ["PDF", "DOCX"],
      size: "5MB",
      lastUpdated: "January 2025"
    }
  ],
  pressKit: [
    {
      title: "Product Images",
      description: "High-resolution product photography",
      formats: ["ZIP"],
      size: "45MB",
      lastUpdated: "January 2025"
    },
    {
      title: "Press Releases Archive",
      description: "Historical press releases and announcements",
      formats: ["PDF", "DOCX"],
      size: "20MB",
      lastUpdated: "January 2025"
    },
    {
      title: "Media Coverage Highlights",
      description: "Featured articles and media mentions",
      formats: ["PDF"],
      size: "15MB",
      lastUpdated: "January 2025"
    }
  ]
};

const mediaHighlights = [
  {
    source: "The Hollywood Reporter",
    title: "The Future of Entertainment: Nalevel Empire's Vision",
    quote: "Setting unprecedented standards in content creation and technological innovation",
    date: "2024",
    awards: ["Editor's Choice", "Innovation Spotlight"],
    link: "#",
    fullArticle: "Full article content...",
    coverImage: "/api/placeholder/800/400"
  },
  {
    source: "Variety",
    title: "How Nalevel Empire is Reshaping Global Entertainment",
    quote: "A masterclass in combining artistic excellence with technological advancement",
    date: "2024",
    awards: ["Industry Impact", "Technology Pioneer"],
    link: "#",
    fullArticle: "Full article content...",
    coverImage: "/api/placeholder/800/400"
  },
  {
    source: "Forbes",
    title: "The Entertainment Revolution: Inside Nalevel Empire",
    quote: "Leading the charge in the next generation of immersive storytelling",
    date: "2024",
    awards: ["Digital Innovator", "Market Disruptor"],
    link: "#",
    fullArticle: "Full article content...",
    coverImage: "/api/placeholder/800/400"
  }
];

const pressContacts = {
  general: {
    email: "press@nalevelempire.com",
    phone: "+1 (555) 123-4567",
    hours: "Monday to Friday, 9:00 AM - 6:00 PM EST",
    response: "Within 24 hours"
  },
  urgent: {
    email: "urgent.press@nalevelempire.com",
    phone: "+1 (555) 987-6543",
    hours: "24/7 for urgent media inquiries",
    response: "Within 2 hours"
  },
  regional: {
    EMEA: {
      email: "press.emea@nalevelempire.com",
      phone: "+44 (0) 20 7123 4567"
    },
    APAC: {
      email: "press.apac@nalevelempire.com",
      phone: "+65 6789 0123"
    },
    LATAM: {
      email: "press.latam@nalevelempire.com",
      phone: "+52 55 1234 5678"
    }
  }
};

export default function PressMedia() {
  const [selectedPressRelease, setSelectedPressRelease] = useState(null);
  const [selectedMediaKit, setSelectedMediaKit] = useState('brandAssets');

  return (
    <section className="space-y-12">
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-bold">Press & Media Center</h2>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Access the latest news, media resources, and press materials from Nalevel Empire.
        </p>
      </motion.div>

      {/* Featured News Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {pressReleases.map((release, index) => (
          <motion.div
            key={release.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="mb-4">
                        {release.category}
                      </Badge>
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        {release.impact}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {release.title}
                    </h3>
                    
                    <p className="text-muted-foreground">
                      {release.description}
                    </p>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {release.date}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{release.stats.views} views</span>
                        <span className="text-muted-foreground">{release.stats.shares} shares</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{release.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <img 
                    src={release.coverImage} 
                    alt={release.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{release.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {release.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {release.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Press Kit
                    </Button>
                    <div className="flex gap-4">
                      <Button size="icon" variant="ghost">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>

      {/* Media Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Media Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="brandAssets" className="space-y-6">
            <TabsList>
              <TabsTrigger value="brandAssets" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Brand Assets
              </TabsTrigger>
              <TabsTrigger value="mediaKit" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Media Kit
              </TabsTrigger>
              <TabsTrigger value="pressKit" className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Press Kit
              </TabsTrigger>
            </TabsList>

            {Object.entries(mediaResources).map(([key, resources]) => (
              <TabsContent key={key} value={key} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource) => (
                  <div
                    key={resource.title}
                    className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="space-y-4">
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {resource.formats.map((format) => (
                          <Badge key={format} variant="secondary">
                            {format}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">
                          {resource.size} • Updated {resource.lastUpdated}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Press Contacts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Press Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">General Press Inquiries</h4>
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${pressContacts.general.email}`} className="hover:underline">
                    {pressContacts.general.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{pressContacts.general.phone}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{pressContacts.general.hours}</p>
                  <p>Response time: {pressContacts.general.response}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Regional Press Offices</h4>
              <div className="grid gap-4">
                {Object.entries(pressContacts.regional).map(([region, contact]) => (
                  <div key={region} className="flex items-center justify-between">
                    <span className="font-medium">{region}</span>
                    <div className="text-right">
                      <a href={`mailto:${contact.email}`} className="text-sm hover:underline block">
                        {contact.email}
                      </a>
                      <span className="text-sm text-muted-foreground">{contact.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Urgent Media Inquiries</h4>
              <div className="p-4 rounded-lg bg-muted">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${pressContacts.urgent.email}`} className="hover:underline">
                      {pressContacts.urgent.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{pressContacts.urgent.phone}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{pressContacts.urgent.hours}</p>
                    <p>Response time: {pressContacts.urgent.response}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Schedule a Briefing</h3>
              <p className="text-primary-foreground/80">
                Request an interview or briefing with our leadership team.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <h4 className="font-medium">Available for:</h4>
                <ul className="space-y-2 text-primary-foreground/80">
                  <li className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Press Interviews
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Media Briefings
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4" />
                    Industry Events
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="secondary" 
                className="w-full"
              >
                Request Press Briefing
                <Calendar className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative h-[400px] rounded-xl overflow-hidden"
      >
        <img
          src="/api/placeholder/1600/800"
          alt="Press coverage highlight"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
          <div className="relative h-full flex items-center p-12">
            <div className="max-w-2xl space-y-6">
              <Badge className="mb-4" variant="secondary">Featured in Forbes</Badge>
              <h3 className="text-3xl font-bold text-white">
                "The Next Chapter in Entertainment Innovation"
              </h3>
              <p className="text-lg text-gray-200">
                An in-depth look at how Nalevel Empire is revolutionizing the entertainment
                industry through groundbreaking technology and creative excellence.
              </p>
              <div className="flex gap-4">
                <Button>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Watch Interview
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <FileText className="w-4 h-4 mr-2" />
                  Read Article
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}