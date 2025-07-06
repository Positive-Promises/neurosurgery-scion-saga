import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, RefreshCw, ExternalLink } from 'lucide-react';
import { MedicalDataService } from '@/utils/MedicalDataService';

interface MedicalFactsPanelProps {
  category?: 'anatomy' | 'surgery' | 'neurology' | 'general';
  className?: string;
}

const MedicalFactsPanel: React.FC<MedicalFactsPanelProps> = ({ 
  category = 'neurology', 
  className = '' 
}) => {
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [medicalData, setMedicalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMedicalData();
  }, [category]);

  const loadMedicalData = () => {
    const data = MedicalDataService.getMedicalDataByCategory(category);
    setMedicalData(data);
    
    if (data.length > 0) {
      generateRandomFact();
    }
  };

  const generateRandomFact = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const fact = MedicalDataService.getRandomMedicalFact();
      setCurrentFact(fact);
      setIsLoading(false);
    }, 500);
  };

  const getFactsByCategory = () => {
    return medicalData.filter(item => 
      item.category === category || 
      (category === 'neurology' && (
        item.content?.toLowerCase().includes('brain') ||
        item.content?.toLowerCase().includes('neuron') ||
        item.content?.toLowerCase().includes('nervous')
      ))
    );
  };

  const categoryFacts = getFactsByCategory();

  return (
    <Card className={`${className} bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 dark:text-blue-200">Medical Knowledge</span>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {medicalData.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No medical data available yet. Use the Medical Data Scraper to gather information from trusted sources.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.open('/medical-scraper', '_blank')}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Medical Scraper
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  Medical Fact
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateRandomFact}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                </div>
              ) : currentFact ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentFact}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Click the refresh button to get a medical fact
                </p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Available Sources ({categoryFacts.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categoryFacts.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-xs bg-white/40 dark:bg-gray-800/40 p-2 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{item.title}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.source}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 truncate">
                      {item.content?.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {categoryFacts.length > 5 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-blue-600 border-blue-600"
                onClick={() => window.open('/medical-scraper', '_blank')}
              >
                View All {categoryFacts.length} Sources
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalFactsPanel;