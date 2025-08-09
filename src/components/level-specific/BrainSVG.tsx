import React, { useState } from 'react';

interface BrainSVGProps {
  onRegionClick: (region: string) => void;
}

const BrainSVG: React.FC<BrainSVGProps> = ({ onRegionClick }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    onRegionClick(region);
  };

  const getRegionStyle = (region: string) => {
    return {
      cursor: 'pointer',
      fillOpacity: selectedRegion === region ? 0.8 : 1,
      stroke: selectedRegion === region ? 'gold' : 'black',
      strokeWidth: selectedRegion === region ? 4 : 2,
    };
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" id="svg2" width="1024" height="731" fillRule="evenodd" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" textRendering="geometricPrecision" viewBox="0 0 1024 732">
      <g id="g2800">
        {/* Frontal Lobe */}
        <path
          fill="#fcfb98"
          d="M564 54c13-2 26-1 38 6 38-7 66-1 83 18 14-3 29 1 43 11 39 17 67 39 89 64 36 15 50 33 52 53 19 14 31 31 39 50L798 413l-343-43-103-161L564 54z"
          onClick={() => handleRegionClick('Frontal Lobe')}
          style={getRegionStyle('Frontal Lobe')}
        />
        {/* Parietal Lobe */}
        <path
          fill="#b4d8ec"
          d="m573 52-15 38c-64 5-78 25-58 57 12 14-10 26-16 42-6 20-13 41-23 62 0 54-31 50-28 69l22 29-191 199c-95 15-146 7-160-20-29-10-47-42-53-96-15-16-16-31-11-47-2-6-3-12 1-18-8-26-4-40 1-53 2-20 12-37 27-52-1-25 14-38 34-46 16-51 88-86 117-94 19-17 45-27 77-31 16-7 31-12 46-14 28-18 60-21 92-21 26-9 53-12 81-6l57 2z"
          onClick={() => handleRegionClick('Parietal Lobe')}
          style={getRegionStyle('Parietal Lobe')}
        />
        {/* Cerebellum */}
        <path
          fill="#8a686e"
          fillOpacity=".605"
          stroke="#000"
          strokeWidth="2"
          d="M518 579c7 28 20 47 41 55 30 14 53 48 77 78 13-7 27-13 38-23L560 553l-42 26z"
          onClick={() => handleRegionClick('Cerebellum')}
          style={getRegionStyle('Cerebellum')}
        />
        {/* Brain Stem */}
        <path
          fill="#9487f4"
          stroke="#000"
          strokeWidth="2"
          d="M551 571c0 6 1 12 7 18 2 34 15 45 33 45 80 51 141 54 187 24 19-11 49-22 51-33 22-11 35-22 47-33 19-16 19-44 11-79-190-6-286 19-336 58z"
          onClick={() => handleRegionClick('Brain Stem')}
          style={getRegionStyle('Brain Stem')}
        />
        {/* Temporal Lobe */}
        <path
          fill="#b6cf9d"
          d="m564 312 266 42c39 46 78 92 116 138-28 27-66 31-107 25-17 9-43 14-82 0-15 9-30 15-45 20-24 13-49 17-75 17-24 4-45 7-54 0-15 12-28 17-39 20-17 10-31 13-45 16-12 29-41 41-81 41-27 12-54 13-82-12-20-10-39-22-49-46-7-8-13-15-19-23-3-28 4-53 25-74 20-11 23-40 35-60 23-27 60-38 99-46 17-17 37-29 67-27 17-17 37-32 70-31z"
          onClick={() => handleRegionClick('Temporal Lobe')}
          style={getRegionStyle('Temporal Lobe')}
        />
        {/* Occipital Lobe */}
        <path
          fill="#f7a6b6"
          d="M906 255c-29 26-48 42-73 72-7 25-3 50 7 75 .0712 9.7227-21.46081 18.0795-26.87713 27.47625-3.07324 5.33175-17.41927 44.70616-23.98828 48.24916-6.00733 3.24006-11.61249 3.68966-13.44478 9.80025-.22505.75054-11.43717 11.00398-12.9275 12.00546-9.45919 6.35645-13.84 6.04707-12.23856 8.5322 2.32615 3.60974 3.16585 5.9875 6.58798 7.41601 3.42214 1.42852 30.32142 8.8332 34.30371 8.3266 4.06809-.51753 19.74199 1.27118 23.67569 1.02461 3.86003-.24194 9.1993-2.09306 12.35817-2.92937 4.00987-1.06161 9.69306-5.98194 11.91162-5.8475 16.51772 1.00093 35.6613 1.33924 58.00849-1.45406C931.68151 505.74521 916.9636 510.40581 948 493c10-12 18-28 26-56 7-11 6-29 3-46 6-24-5-33-20-50-4-15-9-34-27-49 1-10-4-26-24-37z"
          onClick={() => handleRegionClick('Occipital Lobe')}
          style={getRegionStyle('Occipital Lobe')}
        />
        {/* The rest of the paths are for detail and are not interactive for this example */}
        <path fill="none" stroke="#000" strokeWidth="4" d="M436 56c-31-2-66 4-96 21-15 1-31 9-44 15-29 2-54 12-76 29-19 6-39 13-56 28-32 19-53 41-63 68-21 7-32 23-32 45-15 13-25 30-27 52-8 17-7 34-2 51-1 6-5 13 0 19-5 11-3 22 2 33 3 0 4 13 8 15 2 29 9 48 18 62 10 16 20 30 36 34 16 32 82 30 162 19 7 11 14 19 21 27 11 23 29 37 51 46 18 16 40 27 81 11 39-2 70-11 80-41 10-1 23-6 44-16 15-3 27-11 38-20 11 8 34 4 57 0 36-2 61-7 73-17 17-5 34-10 47-20 30 10 58 14 81 0 67 7 120-7 134-79 11-12 8-30 3-48 11-18-4-33-19-49-2-21-12-36-27-49 2-14-3-26-23-36-8-24-22-39-39-50 0-25-21-41-52-53-24-29-54-50-89-65-14-11-28-12-42-10-16-20-44-25-82-18-10-7-21-7-31-7-23-2-43-3-60-3-29-6-53-2-76 6z"/>
      </g>
    </svg>
  );
};

export default BrainSVG;
