import React, { useState } from 'react';

const SpineSVG = ({ onRegionClick }: { onRegionClick: (region: string) => void }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    onRegionClick(region);
    console.log(`Clicked on: ${region}`);
  };

  const getSpineRegionClass = (region: string) => {
    let className = 'spine-region';
    if (selectedRegion === region) {
      className += ' selected';
    }
    return className;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1120 1080"
        style={{ width: '80%', height: 'auto', margin: '0 auto' }}
      >
        <style>
          {`
            .spine-region {
              cursor: pointer;
              fill: #d3d3d3; /* Light gray for non-selected regions */
              stroke: #333;
              stroke-width: 1.5;
              transition: fill 0.3s ease;
            }
            .spine-region:hover {
              fill: #a2d5f2; /* Light blue on hover */
            }
            .selected {
              fill: #f2a2a2; /* Light red when selected */
            }
            .tool-icon {
                cursor: pointer;
                border: 2px solid transparent;
                margin: 5px;
                padding: 5px;
            }
            .tool-icon.selected-tool {
                border-color: #007bff;
                background-color: #e7f3ff;
            }
          `}
        </style>

        {/* Cervical Vertebrae (C1-C7) */}
        <g id="cervical-spine" className={getSpineRegionClass('Cervical')} onClick={() => handleRegionClick('Cervical')}>
          <title>Cervical Spine (C1-C7)</title>
          <path d="M583.2,225.48a24.62,24.62,0,1,0,24.62,24.62,24.62,24.62,0,0,0-24.62-24.62Z" />
          <path d="M579.24,205.59a27,27,0,1,0,27,27,27,27,0,0,0-27-27Z" />
          <path d="M580.93,257.04A25.16,25.16,0,1,0,606.09,232,25.16,25.16,0,0,0,580.93,257.04Z" />
          <path d="M568.27,275a30,30,0,1,0,30,30,30,30,0,0,0-30-30Z" />
          <path d="M561.51,298a31.39,31.39,0,1,0,31.39,31.39A31.39,31.39,0,0,0,561.51,298Z" />
          <path d="M548.92,314.38a35.08,35.08,0,1,0,35.08,35.08A35.08,35.08,0,0,0,548.92,314.38Z" />
          <path d="M539.23,337.69a34.47,34.47,0,1,0,34.47,34.47A34.47,34.47,0,0,0,539.23,337.69Z" />
        </g>

        {/* Thoracic Vertebrae (T1-T12) */}
        <g id="thoracic-spine" className={getSpineRegionClass('Thoracic')} onClick={() => handleRegionClick('Thoracic')}>
          <title>Thoracic Spine (T1-T12)</title>
          <path d="M531.12,360a35.59,35.59,0,1,0,35.59,35.59A35.59,35.59,0,0,0,531.12,360Z" />
          <path d="M522.09,384.53a37.62,37.62,0,1,0,37.62,37.62A37.62,37.62,0,0,0,522.09,384.53Z" />
          <path d="M514.55,414.51a38.28,38.28,0,1,0,38.28,38.28A38.28,38.28,0,0,0,514.55,414.51Z" />
          <path d="M510.86,442.79a38.25,38.25,0,1,0,38.25,38.25A38.25,38.25,0,0,0,510.86,442.79Z" />
          <path d="M509.56,470.67a37.75,37.75,0,1,0,37.75,37.75A37.75,37.75,0,0,0,509.56,470.67Z" />
          <path d="M510.41,499.68a37,37,0,1,0,37,37A37,37,0,0,0,510.41,499.68Z" />
          <path d="M513.84,527.23a37.08,37.08,0,1,0,37.08,37.08A37.08,37.08,0,0,0,513.84,527.23Z" />
          <path d="M519.95,544.25a32,32,0,1,0,32,32,32,32,0,0,0-32-32Z" />
          <path d="M528.22,575.31a31.09,31.09,0,1,0,31.09,31.09A31.09,31.09,0,0,0,528.22,575.31Z" />
          <path d="M538.1,608.86a32.14,32.14,0,1,0,32.14,32.14A32.14,32.14,0,0,0,538.1,608.86Z" />
          <path d="M544.63,647.22a32.22,32.22,0,1,0,32.22,32.22A32.22,32.22,0,0,0,544.63,647.22Z" />
          <path d="M554.32,685.88a32.91,32.91,0,1,0,32.91,32.91A32.91,32.91,0,0,0,554.32,685.88Z" />
        </g>

        {/* Lumbar Vertebrae (L1-L5) */}
        <g id="lumbar-spine" className={getSpineRegionClass('Lumbar')} onClick={() => handleRegionClick('Lumbar')}>
          <title>Lumbar Spine (L1-L5)</title>
          <path d="M562.58,725a32.77,32.77,0,1,0,32.77,32.77A32.77,32.77,0,0,0,562.58,725Z" />
          <path d="M565.52,762.75a32.33,32.33,0,1,0,32.33,32.33A32.33,32.33,0,0,0,565.52,762.75Z" />
          <path d="M564.55,806.46a32.6,32.6,0,1,0,32.6,32.6A32.6,32.6,0,0,0,564.55,806.46Z" />
          <path d="M516.14,808a18,18,0,1,0,18,18,18,18,0,0,0-18-18Z" />
          <path d="M522.63,768.69a20.53,20.53,0,1,0,20.53,20.53A20.53,20.53,0,0,0,522.63,768.69Z" />
        </g>

        {/* Sacrum and Coccyx */}
        <g id="sacrum-coccyx" className={getSpineRegionClass('Sacrum')} onClick={() => handleRegionClick('Sacrum')}>
          <title>Sacrum and Coccyx</title>
          <path d="M526.46,901.39a73.39,73.39,0,1,0,73.39,73.39A73.39,73.39,0,0,0,526.46,901.39Z" />
          <path d="M518.35,852.73a4.41,4.41,0,1,0,4.41,4.41A4.41,4.41,0,0,0,518.35,852.73Z" />
          <path d="M504.33,870.12a4.44,4.44,0,1,0,4.44,4.44A4.44,4.44,0,0,0,504.33,870.12Z" />
          <path d="M491.47,890.49a4.69,4.69,0,1,0,4.69,4.69A4.69,4.69,0,0,0,491.47,890.49Z" />
          <path d="M483.57,914.58a4.48,4.48,0,1,0,4.48,4.48A4.48,4.48,0,0,0,483.57,914.58Z" />
        </g>
      </svg>
    </div>
  );
};

export default SpineSVG;
