import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users, Landmark, Loader2 } from "lucide-react";
import { DonationForm } from "../components/DonationForm";
import { DonorWall } from "../components/DonorWall";
import { useNGOProjectStore } from "@/stores/useNGOProjectStore";
import { useDonationStore } from "@/stores/useDonationStore";
import { useImpactStore } from "@/stores/useImpactStore";
import { PageHeader } from "../components/PageHeader";
import { useUserStore } from "@/stores/useUserStore";
import { Donation } from "@/types/ngo/donation";

export default function DonatePage() {
  const { user, isLoading } = useUserStore(); //get the isLoading state from the store as well
  const { projects } = useNGOProjectStore();
  const { getDonationStats, donations, addDonation } = useDonationStore();
  const { calculateSummary } = useImpactStore();

  const donationStats = getDonationStats();
  const impactSummary = calculateSummary();

  const handleDonationSuccess = (donation: Donation) => {
    addDonation(donation);
  };

  const recentDonors = donations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(d => ({
      id: d.id,
      name: d.donor.name,
      amount: d.amount,
      donatedAt: d.date,
      isAnonymous: d.anonymous,
      message: d.message
    }));

  const stats = [
    {
      icon: Heart,
      label: "Total Donations",
      value: `$${(donationStats.totalAmount/1000).toFixed(1)}K`,
    },
    {
      icon: Target,
      label: "Projects Funded",
      value: projects.filter(p => p.donations.length > 0).length,
    },
    {
      icon: Users,
      label: "Lives Impacted",
      value: `${(impactSummary.totalImpact/1000).toFixed(1)}K+`,
    },
    {
      icon: Landmark,
      label: "Communities Served",
      value: new Set(projects.map(p => p.location.city)).size,
    }
  ];

  if (isLoading) {
    return <Loader2 className="h-16 w-16 animate-spin" />
  }

  if (!user) return null; // This is still correct logic if a user doesn't exist

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Make a Donation" 
        subtitle="Support our mission to create positive change"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <DonationForm 
              currentUser={user}
              onSuccess={handleDonationSuccess}
            />
          </div>
          <div>
            <DonorWall donors={recentDonors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}