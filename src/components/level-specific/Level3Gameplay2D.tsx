import React from 'react';
import AnatomyLevel from '../AnatomyLevel';
import SkullSVG from './SkullSVG';

const Level3Gameplay2D: React.FC = () => {
  return (
    <AnatomyLevel
      title="Level 3: 2D Cranial Anatomy"
      initialFeedback="Select a bone to learn more about it."
      SVGComponent={(props) => <SkullSVG onBoneClick={props.onRegionClick} />}
    />
  );
};

export default Level3Gameplay2D;
