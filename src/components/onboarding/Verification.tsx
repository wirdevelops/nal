import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import {ProgressTracker} from "./ProgressTracker";
import { Button } from "@/components/ui/button"; 

export const Verification = () => {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Verify Your Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload your ID
            </p>
            <input type="file" className="hidden" />
          </div>
          <Button className="w-full">Submit Verification</Button>
        </CardContent>
      </Card>
    );
  };
  
  export default function OnboardingLayout({ children }) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProgressTracker 
            currentStage="basic-info"
            stages={['setup', 'role-selection', 'basic-info', 'role-details', 'verification']}
          />
          {children}
        </div>
      </div>
    );
  }