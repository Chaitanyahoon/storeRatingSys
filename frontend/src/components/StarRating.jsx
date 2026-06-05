import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (readOnly || !onChange) return;
    onChange(index);
  };

  const displayedRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= displayedRating;
        return (
          <Star
            key={index}
            className={`w-6 h-6 transition-all duration-150 ${
              readOnly ? '' : 'cursor-pointer transform hover:scale-120 active:scale-95'
            } ${
              isFilled
                ? 'fill-amber-400 text-amber-400 star-glow-4'
                : 'text-slate-600 hover:text-slate-500'
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
