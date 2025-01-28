import React from 'react';
import { Globe } from 'lucide-react';

const MarketplaceFeature = () => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-card">
      <div className="p-4 rounded-full bg-primary-foreground text-primary mb-4">
        <Globe className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">Marketplace</h3>
      <p className="text-center text-muted-foreground">
        Discover equipment, digital assets, and services.
      </p>
    </div>
  );
};

export default MarketplaceFeature;
