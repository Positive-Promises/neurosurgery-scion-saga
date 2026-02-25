import React from 'react';
import AnatomyLevel from '../AnatomyLevel';
import BrainSVG from './BrainSVG';

const Level1Gameplay2D: React.FC = () => {
  return (
    <AnatomyLevel
      title="Level 1 - 2D Brain Anatomy"
      initialFeedback="Select a region of the brain to learn more."
      SVGComponent={(props) => <BrainSVG onRegionClick={props.onRegionClick} />}
    />
  );
};

export default Level1Gameplay2D;
