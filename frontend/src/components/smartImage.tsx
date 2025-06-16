import React, { useState } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const SmartImage: React.FC<SmartImageProps> = ({ src, alt, fallbackSrc, ...props }) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    setIsEmpty(true);
    if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      data-empty={isEmpty}
      onError={handleError}
      {...props}
    />
  );
};

export default SmartImage;
