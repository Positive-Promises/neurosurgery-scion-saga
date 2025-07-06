import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen } from 'lucide-react';
import { BrainRegion } from '@/data/brainAnatomy';

interface BrainEducationPanelProps {
  selectedRegion: BrainRegion | null;
  hoveredRegion: BrainRegion | null;
  identifiedCount: number;
  totalRegions: number;
  className?: string;
}

const BrainEducationPanel: React.FC<BrainEducationPanelProps> = ({
  selectedRegion,
  hoveredRegion,
  identifiedCount,
  totalRegions,
  className = ''
}) => {
  const displayRegion = selectedRegion || hoveredRegion;

  return (
    <Card className={`${className} bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 dark:text-blue-200">Brain Anatomy</span>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {identifiedCount}/{totalRegions} Identified
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayRegion ? (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-200 mb-2">
                {displayRegion.name}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {displayRegion.fullDescription}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                Key Functions:
              </h4>
              <div className="flex flex-wrap gap-2">
                {displayRegion.functions.map((func, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {func}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Clinical Relevance
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {displayRegion.clinicalRelevance}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-400">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                Surgical Considerations
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                {displayRegion.surgicalConsiderations}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Hover over or click brain regions to learn more
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Identify all {totalRegions} major brain regions to complete Level 1
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Brain className="w-3 h-3" />
            <span>Information based on NINDS Brain Basics</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrainEducationPanel;