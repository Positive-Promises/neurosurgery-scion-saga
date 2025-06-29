
import React from 'react';
import { cn } from '@/lib/utils';

interface MedicalCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'diagnostic' | 'surgical';
  blur?: 'light' | 'medium' | 'heavy';
}

const MedicalCard: React.FC<MedicalCardProps> = ({
  children,
  className,
  variant = 'primary',
  blur = 'medium'
}) => {
  const baseClasses = "backdrop-blur-md border border-white/20 rounded-2xl shadow-xl";
  
  const variantClasses = {
    primary: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/15 hover:to-cyan-500/15",
    secondary: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/15 hover:to-teal-500/15",
    diagnostic: "bg-gradient-to-br from-purple-500/10 to-indigo-500/10 hover:from-purple-500/15 hover:to-indigo-500/15",
    surgical: "bg-gradient-to-br from-red-500/10 to-orange-500/10 hover:from-red-500/15 hover:to-orange-500/15"
  };

  const blurClasses = {
    light: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    heavy: "backdrop-blur-lg"
  };

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      blurClasses[blur],
      "transition-all duration-300 ease-out hover:shadow-2xl hover:scale-[1.02]",
      className
    )}>
      {children}
    </div>
  );
};

export default MedicalCard;
