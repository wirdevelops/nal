import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface OptimizationSuggestionsProps {
  analysis: {
    size: number;
    dimensions: { width: number; height: number };
    format: string;
    suggestions: string[];
  };
  onOptimize?: () => void;
  optimizationProgress?: number;
}

export function OptimizationSuggestions({
  analysis,
  onOptimize,
  optimizationProgress
}: OptimizationSuggestionsProps) {
  // Calculate optimization score
  const calculateScore = () => {
    let score = 100;
    
    // Deduct points for large file size
    if (analysis.size > 2 * 1024 * 1024) score -= 30;
    else if (analysis.size > 1024 * 1024) score -= 15;

    // Deduct points for large dimensions
    if (analysis.dimensions.width > 3840 || analysis.dimensions.height > 2160) score -= 20;
    else if (analysis.dimensions.width > 1920 || analysis.dimensions.height > 1080) score -= 10;

    // Deduct points for old format
    if (!['webp', 'avif'].includes(analysis.format.toLowerCase())) score -= 15;

    // Deduct points for each suggestion
    score -= analysis.suggestions.length * 5;

    return Math.max(0, score);
  };

  const score = calculateScore();
  const needsOptimization = score < 80;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Image Analysis</CardTitle>
            <CardDescription>Optimization suggestions and details</CardDescription>
          </div>
          <div className="text-2xl font-bold">
            {score}/100
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Size</span>
            <p className="font-medium">
              {(analysis.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Dimensions</span>
            <p className="font-medium">
              {analysis.dimensions.width} × {analysis.dimensions.height}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Format</span>
            <p className="font-medium">
              {analysis.format.toUpperCase()}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Score</span>
            <div className="flex items-center gap-2">
              <Progress value={score} className="flex-1" />
              <span className="font-medium">{score}%</span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Suggestions</h4>
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm p-2 rounded-lg bg-muted"
                >
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimization Progress */}
        {typeof optimizationProgress === 'number' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Optimization Progress</span>
              <span>{optimizationProgress}%</span>
            </div>
            <Progress value={optimizationProgress} />
          </div>
        )}

        {/* Action Button */}
        {needsOptimization && onOptimize && (
          <Button
            className="w-full"
            onClick={onOptimize}
            disabled={typeof optimizationProgress === 'number'}
          >
            {optimizationProgress !== undefined ? (
              'Optimizing...'
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Auto-Optimize Image
              </>
            )}
          </Button>
        )}

        {/* Optimization Tips */}
        {needsOptimization && (
          <div className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted">
            <Info className="w-4 h-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium">Why optimize?</p>
              <p className="text-muted-foreground mt-1">
                Optimized images load faster, use less bandwidth, and provide a better user experience.
                Our optimizer will automatically adjust the image while maintaining quality.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}