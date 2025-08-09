import React from 'react';

interface BioDigitalModelProps {
  modelId: string;
  className?: string;
}

const BioDigitalModel: React.FC<BioDigitalModelProps> = ({ modelId, className }) => {
  const embedUrl = `https://human.biodigital.com/widget/?m=${modelId}&ui-tools=true&ui-fullscreen=true&ui-center=true`;

  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        title={`BioDigital Model ${modelId}`}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default BioDigitalModel;
