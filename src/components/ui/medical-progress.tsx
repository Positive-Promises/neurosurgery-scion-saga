
import React from 'react';
import { cn } from '@/lib/utils';

interface MedicalProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'primary' | 'diagnostic' | 'surgical' | 'emergency';
  showPercentage?: boolean;
  label?: string;
  'aria-label'?: string;
}

const MedicalProgress: React.FC<MedicalProgressProps> = ({
  value,
  max = 100,
  className,
  variant = 'primary',
  showPercentage = true,
  label,
  'aria-label': ariaLabel
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantClasses = {
    primary: "from-blue-400 to-cyan-400",
    diagnostic: "from-purple-400 to-indigo-400",
    surgical: "from-red-400 to-orange-400",
    emergency: "from-red-500 to-red-600"
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center text-sm text-white/80">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="relative h-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 overflow-hidden">
        <div
          className={cn(
            "h-full bg-gradient-to-r transition-all duration-700 ease-out rounded-full",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemax={max}
          aria-label={ariaLabel || `Progress: ${Math.round(percentage)}%`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default MedicalProgress;
