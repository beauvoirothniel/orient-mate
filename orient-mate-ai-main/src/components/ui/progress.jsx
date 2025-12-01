//src/components/ui/progress.jsx
import React from 'react';

const Progress = React.forwardRef(({ 
  value = 0, 
  className = '', 
  ...props 
}, ref) => {
  const percentage = Math.min(100, Math.max(0, value));
  
  return (
    <div
      ref={ref}
      className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };