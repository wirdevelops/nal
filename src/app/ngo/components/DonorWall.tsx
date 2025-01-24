import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface DonorWallDonor {
  id: string;
  name: string;
  amount: number;
  donatedAt: string;
  isAnonymous: boolean;
  message?: string;
}

interface DonorWallProps {
  donors: DonorWallDonor[];  // Changed from recentDonors to donors
  title?: string;
}

export function DonorWall({ donors, title = "Recent Supporters" }: DonorWallProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {donors.map((donor) => (
          <div key={donor.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">{donor.isAnonymous ? "Anonymous Donor" : donor.name}</p>
              {donor.message && (
                <p className="text-sm text-muted-foreground mt-1">{donor.message}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">${donor.amount}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(donor.donatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {donors.length === 0 && (
          <p className="text-center text-muted-foreground">No donations yet</p>
        )}
      </CardContent>
    </Card>
  );
}