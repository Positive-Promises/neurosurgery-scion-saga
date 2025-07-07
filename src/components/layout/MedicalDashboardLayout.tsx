
import React from 'react';
import { Card } from '@/components/ui/card';

interface MedicalDashboardLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  topBar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const MedicalDashboardLayout: React.FC<MedicalDashboardLayoutProps> = ({
  leftPanel,
  rightPanel,
  topBar,
  children,
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-slate-900 flex flex-col ${className}`}>
      {/* Top Bar */}
      <div className="h-16 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 flex-shrink-0 z-50">
        {topBar}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Objectives Panel */}
        <div className="w-80 bg-slate-800/95 backdrop-blur-sm border-r border-slate-600 flex-shrink-0 overflow-hidden">
          <Card className="h-full bg-transparent border-0 rounded-none">
            {leftPanel}
          </Card>
        </div>

        {/* Center - 3D Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>

        {/* Right Sidebar - Brain Education Panel */}
        <div className="w-96 bg-slate-800/95 backdrop-blur-sm border-l border-slate-600 flex-shrink-0 overflow-hidden">
          <Card className="h-full bg-transparent border-0 rounded-none">
            {rightPanel}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboardLayout;
