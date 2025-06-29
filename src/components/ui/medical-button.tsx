
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MedicalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'diagnostic' | 'surgical' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  role?: string;
}

const MedicalButton: React.FC<MedicalButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  'aria-label': ariaLabel,
  role
}) => {
  const baseClasses = "backdrop-blur-md border border-white/30 rounded-xl shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:outline-none";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-white focus:ring-blue-400",
    secondary: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-white focus:ring-emerald-400",
    diagnostic: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-white focus:ring-purple-400",
    surgical: "bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-white focus:ring-red-400",
    emergency: "bg-gradient-to-r from-red-600/30 to-red-700/30 hover:from-red-600/40 hover:to-red-700/40 text-white focus:ring-red-500 animate-pulse"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const disabledClasses = "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100";

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      role={role}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && disabledClasses,
        className
      )}
    >
      {children}
    </Button>
  );
};

export default MedicalButton;
