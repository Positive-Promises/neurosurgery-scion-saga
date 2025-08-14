import React, { Suspense } from 'react';
import RealisticBrainModel from './RealisticBrainModel';
import FallbackBrainModel from './FallbackBrainModel';
import { BrainRegion } from '@/data/brainAnatomy';

interface SafeBrainModelProps {
  onRegionClick: (region: BrainRegion) => void;
  onRegionHover: (region: BrainRegion | null) => void;
  labeledRegions: Set<string>;
}

const SafeBrainModel: React.FC<SafeBrainModelProps> = ({
  onRegionClick,
  onRegionHover,
  labeledRegions
}) => {
  return (
    <Suspense fallback={
      <FallbackBrainModel
        onRegionClick={onRegionClick}
        onRegionHover={onRegionHover}
        labeledRegions={labeledRegions}
      />
    }>
      <RealisticBrainModel
        onRegionClick={onRegionClick}
        onRegionHover={onRegionHover}
        labeledRegions={labeledRegions}
      />
    </Suspense>
  );
};

export default SafeBrainModel;