import React from 'react';
import { BrainModel } from './PlaceholderModels';
import { BrainRegion } from '@/data/brainAnatomy';

interface FallbackBrainModelProps {
  onRegionClick: (region: BrainRegion) => void;
  onRegionHover: (region: BrainRegion | null) => void;
  labeledRegions: Set<string>;
}

const FallbackBrainModel: React.FC<FallbackBrainModelProps> = ({
  onRegionClick,
  onRegionHover,
  labeledRegions
}) => {
  const handleInteraction = (partName: string) => {
    // Map placeholder part names to brain regions
    const regionMap: Record<string, string> = {
      'cerebrum': 'cerebrum',
      'cerebellum': 'cerebellum',
      'brainstem': 'brain_stem',
      'frontal-lobe': 'frontal_lobe',
      'parietal-lobe': 'parietal_lobe',
      'occipital-lobe': 'occipital_lobe',
      'temporal-lobe': 'temporal_lobe'
    };

    const regionId = regionMap[partName.toLowerCase()];
    if (regionId) {
      import('@/data/brainAnatomy').then(({ BRAIN_REGIONS }) => {
        const region = BRAIN_REGIONS.find(r => r.id === regionId);
        if (region) {
          onRegionClick(region);
        }
      });
    }
  };

  return (
    <BrainModel 
      interactive={true} 
      onInteraction={handleInteraction}
    />
  );
};

export default FallbackBrainModel;