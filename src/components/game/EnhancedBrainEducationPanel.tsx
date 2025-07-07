
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, AlertTriangle, Stethoscope, Search, Star } from 'lucide-react';
import { BrainRegion } from '@/data/brainAnatomy';

interface EnhancedBrainEducationPanelProps {
  selectedRegion: BrainRegion | null;
  hoveredRegion: BrainRegion | null;
  identifiedCount: number;
  totalRegions: number;
  className?: string;
}

const EnhancedBrainEducationPanel: React.FC<EnhancedBrainEducationPanelProps> = ({
  selectedRegion,
  hoveredRegion,
  identifiedCount,
  totalRegions,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedRegions, setBookmarkedRegions] = useState<Set<string>>(new Set());
  
  const displayRegion = selectedRegion || hoveredRegion;
  const isHovered = !selectedRegion && hoveredRegion;

  const toggleBookmark = (regionId: string) => {
    const newBookmarks = new Set(bookmarkedRegions);
    if (newBookmarks.has(regionId)) {
      newBookmarks.delete(regionId);
    } else {
      newBookmarks.add(regionId);
    }
    setBookmarkedRegions(newBookmarks);
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <CardHeader className="border-b border-slate-600">
        <CardTitle className="flex items-center justify-between text-cyan-400">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Neuroanatomy Guide</span>
          </div>
          <Badge variant="secondary" className="bg-cyan-900/30 text-cyan-300">
            {identifiedCount}/{totalRegions}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-auto">
        {displayRegion ? (
          <div className="space-y-4">
            {/* Region Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {displayRegion.name}
                </h3>
                {isHovered && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Click to Identify
                  </Badge>
                )}
              </div>
              {selectedRegion && (
                <button
                  onClick={() => toggleBookmark(displayRegion.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarkedRegions.has(displayRegion.id)
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slate-700 text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="functions" className="text-xs">Functions</TabsTrigger>
                <TabsTrigger value="clinical" className="text-xs">Clinical</TabsTrigger>
                <TabsTrigger value="surgical" className="text-xs">Surgical</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {displayRegion.fullDescription}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-700/30">
                    <div className="text-xs text-blue-400 mb-1">Location</div>
                    <div className="text-sm text-white capitalize">
                      {displayRegion.name.includes('Left') ? 'Left Hemisphere' : 
                       displayRegion.name.includes('Right') ? 'Right Hemisphere' : 'Central'}
                    </div>
                  </div>
                  <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-700/30">
                    <div className="text-xs text-purple-400 mb-1">Shape</div>
                    <div className="text-sm text-white capitalize">{displayRegion.shape}</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="functions" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {displayRegion.functions.map((func, index) => (
                    <div key={index} className="bg-green-900/20 rounded-lg p-3 border border-green-700/30">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-green-100">{func}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="clinical" className="space-y-4 mt-4">
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700/30">
                  <div className="flex items-start space-x-2 mb-2">
                    <Stethoscope className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <h4 className="font-medium text-yellow-200">Clinical Relevance</h4>
                  </div>
                  <p className="text-sm text-yellow-100 leading-relaxed">
                    {displayRegion.clinicalRelevance}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="surgical" className="space-y-4 mt-4">
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
                  <div className="flex items-start space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <h4 className="font-medium text-red-200">Surgical Considerations</h4>
                  </div>
                  <p className="text-sm text-red-100 leading-relaxed">
                    {displayRegion.surgicalConsiderations}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <BookOpen className="w-16 h-16 text-blue-400 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Explore Brain Anatomy
            </h3>
            <p className="text-gray-400 mb-4 max-w-sm leading-relaxed">
              Hover over or click brain regions in the 3D model to access detailed anatomical information, clinical insights, and surgical considerations.
            </p>
            
            {/* Quick Stats */}
            <div className="bg-slate-700/30 rounded-lg p-4 w-full max-w-sm">
              <div className="text-sm text-gray-300 mb-2">Learning Progress</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Regions Identified</span>
                <span className="text-cyan-400 font-semibold">{identifiedCount}/{totalRegions}</span>
              </div>
            </div>
          </div>
        )}

        {/* NINDS Attribution */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Brain className="w-3 h-3" />
            <span>Educational content based on NINDS Brain Basics</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default EnhancedBrainEducationPanel;
