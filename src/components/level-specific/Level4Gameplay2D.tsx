import React from 'react';
import AnatomyLevel from '../AnatomyLevel';
import SpinalCordSVG from './SpinalCordSVG';

const Level4Gameplay2D: React.FC = () => {
  return (
    <AnatomyLevel
      title="Level 4: 2D Spinal Cord Anatomy"
      initialFeedback="Select a region of the spinal cord to learn more."
      SVGComponent={(props) => <SpinalCordSVG onRegionClick={props.onRegionClick} />}
    />
  );
};

export default Level4Gameplay2D;
