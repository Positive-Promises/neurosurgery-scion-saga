import React, { useState } from 'react';

const SpinalCordSVG = ({ onRegionClick }: { onRegionClick: (region: string) => void }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    onRegionClick(region);
    console.log(`Clicked on: ${region}`);
  };

  const getRegionClass = (region: string) => {
    return `spinal-cord-region ${selectedRegion === region ? 'selected' : ''}`;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="716"
        height="615"
        viewBox="0 0 716 615"
        style={{ width: '90%', height: 'auto', margin: '0 auto' }}
      >
        <style>
          {`
            .spinal-cord-region {
              cursor: pointer;
              transition: fill 0.2s ease-in-out;
            }
            .spinal-cord-region:hover {
              fill: rgba(162, 213, 242, 0.7);
            }
            .selected {
              fill: rgba(242, 162, 162, 0.8);
            }
            .gray-matter { fill: #cccccc; }
            .white-matter { fill: #f0f0f0; }
            .ganglion { fill: #ffcc80; }
          `}
        </style>

        {/* White Matter */}
        <g id="white-matter" className={getRegionClass('White Matter')} onClick={() => handleRegionClick('White Matter')}>
          <title>White Matter</title>
          <path d="M404.298 416.924c-19.088-.311-26.05 11.53-11.725 24.38 16.31 30.354 9.99 82.537-7.226 86.121-24.133 21.1-53.364 12.622-77.042 1.468-22.182-.497-42.411-11.609-50.997-34.817-30.318-11.345-43.235-15.853-49.632-38.839-19.356-24.144-24.813-57.384-19.003-87.222 3.206-20.36 12.809-42.471 31.465-48.65-7.808-25.817 8.782-42.162 24.946-58.905 13.459-17.055 32.426.095 46.181-27.783 2.362-22.913 19.852-33.275 43.408-35.02 13.354-6.394 17.03 9.155 35.184-7.798 9.456-10.264 24.067-5.148 35.55-1.582" style={{fill: '#f0f0f0', stroke: '#000', strokeWidth: '1px'}} />
          <path d="M404.571 416.924c19.088-.311 26.051 11.53 11.726 24.38-16.31 30.354-9.99 82.537 7.226 86.121 24.133 21.1 53.363 12.622 77.041 1.468 22.182-.497 42.412-11.609 50.997-34.817 30.318-11.345 43.236-15.853 49.632-38.839 19.356-24.144 24.814-57.384 19.003-87.222-3.206-20.36-12.808-42.471-31.465-48.65 7.808-25.817-8.782-42.162-24.946-58.905-13.458-17.055-32.425.095-46.18-27.783-2.362-22.913-19.852-33.275-43.409-35.02-13.354-6.394-17.03 9.155-35.184-7.798-9.456-10.264-24.067-5.148-35.55-1.582" style={{fill: '#f0f0f0', stroke: '#000', strokeWidth: '1px'}} />
        </g>

        {/* Gray Matter */}
        <g id="gray-matter" className={getRegionClass('Gray Matter')} onClick={() => handleRegionClick('Gray Matter')}>
            <title>Gray Matter</title>
            <path d="M406.368 379.741c-14.194.652-33.563 2.241-41.123-12.734-5.71-18.424-7.908-37.785-13.563-56.213.587-18.167-8.154-35.982-27.903-38.124-17.904-4.305-18.066-23.257-24.858-36.463-14.484 7.25-.501 28.462 3.028 40.066 4.771 18.356 19.34 32.124 26.688 49.406 9.069 15.402 7.76 39.256-9.685 48.208-18.181 12.11-45.636 13.009-55.624 35.253-9.569 17.955 10.388 33.097 26.212 35.105 15.86 8.224 33.87 16.884 51.947 15.987 19.952-3.158 20.563-23.842 19.433-39.261 6.648-17.555 28.462-20.835 44.893-20.696" style={{fill: '#cccccc', stroke: '#000', strokeWidth: '1px'}} transform="translate(33.477 -125.566)" />
            <path d="M405.126 379.741c14.194.652 33.563 2.241 41.123-12.734 5.71-18.424 7.908-37.785 13.563-56.213-.587-18.167 8.154-35.982 27.903-38.124 17.905-4.305 18.066-23.257 24.859-36.463 14.483 7.25.5 28.462-3.03 40.066-4.77 18.356-19.339 32.124-26.687 49.406-9.068 15.402-7.76 39.256 9.685 48.208 18.182 12.11 45.636 13.009 55.624 35.253 9.569 17.955-10.388 33.097-26.212 35.105-15.86 8.224-33.87 16.884-51.947 15.987-19.951-3.158-20.562-23.842-19.432-39.261-6.648-17.555-28.463-20.835-44.894-20.696" style={{fill: '#cccccc', stroke: '#000', strokeWidth: '1px'}} transform="translate(33.477 -125.566)" />
        </g>

        {/* Central Canal */}
        <g id="central-canal" className={getRegionClass('Central Canal')} onClick={() => handleRegionClick('Central Canal')}>
             <title>Central Canal</title>
             <path d="M410.676 390.008a5.827 4.162 0 1 1-11.654 0 5.827 4.162 0 1 1 11.654 0z" style={{fill: '#fff'}} transform="translate(34.032 -126.676)" />
        </g>
      </svg>
    </div>
  );
};

export default SpinalCordSVG;
