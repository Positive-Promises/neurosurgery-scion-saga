import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, Search, Globe, Database, Download } from 'lucide-react';
import { MedicalDataService } from '@/utils/MedicalDataService';

interface MedicalData {
  url: string;
  title: string;
  content: string;
  source: string;
  category: 'anatomy' | 'surgery' | 'neurology' | 'general';
  timestamp: string;
}

const TRUSTED_SOURCES = [
  {
    name: 'PubMed NCBI',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    description: 'National Library of Medicine database',
    category: 'research'
  },
  {
    name: 'ScienceDirect',
    url: 'http://sciencedirect.com',
    description: 'Scientific journal articles',
    category: 'journals'
  },
  {
    name: 'Wikipedia Medical',
    url: 'https://en.wikipedia.org/wiki/Portal:Medicine',
    description: 'Medical and health information',
    category: 'encyclopedia'
  },
  {
    name: 'Wikibooks Medical',
    url: 'https://www.wikibooks.org/wiki/Subject:Medicine',
    description: 'Open-content medical textbooks',
    category: 'textbooks'
  },
  {
    name: 'JSTOR Medical',
    url: 'http://jstor.org',
    description: 'Academic journals and research',
    category: 'academic'
  },
  {
    name: 'Wiley Online Library',
    url: 'http://onlinelibrary.wiley.com',
    description: 'Medical and scientific publications',
    category: 'journals'
  }
];

const MedicalDataScraper: React.FC = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(MedicalDataService.getApiKey() || '');
  const [searchUrl, setSearchUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedData, setScrapedData] = useState<MedicalData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const isValid = await MedicalDataService.testApiKey(apiKey);
    
    if (isValid) {
      MedicalDataService.saveApiKey(apiKey);
      toast({
        title: "Success",
        description: "API key validated and saved successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleScrapeUrl = async (url: string) => {
    if (!MedicalDataService.getApiKey()) {
      toast({
        title: "Error",
        description: "Please set your Firecrawl API key first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      const result = await MedicalDataService.scrapeUrl(url);
      
      if (result.success && result.data) {
        const medicalData: MedicalData = {
          url: url,
          title: result.data.title || 'Medical Information',
          content: result.data.markdown || result.data.html || '',
          source: new URL(url).hostname,
          category: categorizeContent(result.data.title || '', result.data.markdown || ''),
          timestamp: new Date().toISOString()
        };

        setScrapedData(prev => [...prev, medicalData]);
        
        toast({
          title: "Success",
          description: "Medical data scraped successfully",
        });
      } else {
        toast({
          title: "Error",  
          description: result.error || "Failed to scrape medical data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error scraping medical data:', error);
      toast({
        title: "Error",
        description: "Failed to scrape medical data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const categorizeContent = (title: string, content: string): 'anatomy' | 'surgery' | 'neurology' | 'general' => {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('brain') || text.includes('neuron') || text.includes('nervous') || text.includes('neurolog')) {
      return 'neurology';
    }
    if (text.includes('surgery') || text.includes('surgical') || text.includes('operation')) {
      return 'surgery';
    }
    if (text.includes('anatomy') || text.includes('anatomical') || text.includes('structure')) {
      return 'anatomy';
    }
    return 'general';
  };

  const handleSearchMedicalTerm = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    // Search PubMed for the medical term
    const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(searchTerm)}`;
    await handleScrapeUrl(pubmedUrl);

    // Search Wikipedia for medical information
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm.replace(/\s+/g, '_'))}`;
    await handleScrapeUrl(wikipediaUrl);
  };

  const filteredData = selectedCategory === 'all' 
    ? scrapedData 
    : scrapedData.filter(data => data.category === selectedCategory);

  const exportData = () => {
    const dataStr = JSON.stringify(scrapedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medical_data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <span>Medical Data Scraper</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="scrape">Scrape URLs</TabsTrigger>
              <TabsTrigger value="search">Search Medical Terms</TabsTrigger>
              <TabsTrigger value="data">Scraped Data</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Firecrawl API Key</label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Firecrawl API key"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveApiKey} disabled={isLoading}>
                      {isLoading ? "Testing..." : "Save Key"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Get your API key from{" "}
                    <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      firecrawl.dev
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Trusted Medical Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TRUSTED_SOURCES.map((source, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{source.name}</h4>
                            <p className="text-xs text-gray-600">{source.description}</p>
                          </div>
                          <Badge variant="secondary">{source.category}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scrape" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Medical Website URL</label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type="url"
                      value={searchUrl}
                      onChange={(e) => setSearchUrl(e.target.value)}
                      placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleScrapeUrl(searchUrl)} 
                      disabled={isLoading || !searchUrl.trim()}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Scrape
                    </Button>
                  </div>
                </div>

                {isLoading && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-center text-gray-600">Scraping medical data...</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Quick Access - Trusted Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {TRUSTED_SOURCES.map((source, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleScrapeUrl(source.url)}
                        disabled={isLoading}
                        className="justify-start"
                      >
                        <BookOpen className="w-3 h-3 mr-2" />
                        {source.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Medical Search Term</label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., cerebral cortex, brain surgery, neurons"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSearchMedicalTerm} 
                      disabled={isLoading || !searchTerm.trim()}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Searches PubMed and Wikipedia for medical information
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Suggested Neurological Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'cerebral cortex', 'brainstem', 'cerebellum', 'frontal lobe',
                      'parietal lobe', 'temporal lobe', 'occipital lobe', 'neurosurgery',
                      'brain anatomy', 'neural pathways', 'neuroplasticity', 'craniotomy'
                    ].map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm(term);
                          handleSearchMedicalTerm();
                        }}
                        disabled={isLoading}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="font-semibold">Scraped Medical Data ({scrapedData.length})</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className={selectedCategory === 'all' ? 'bg-blue-100' : ''}
                    >
                      All
                    </Button>
                    {['anatomy', 'surgery', 'neurology', 'general'].map(category => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'bg-blue-100' : ''}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={exportData} disabled={scrapedData.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredData.map((data, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{data.title}</CardTitle>
                        <div className="flex space-x-2">
                          <Badge variant="secondary">{data.category}</Badge>
                          <Badge variant="outline">{data.source}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>URL:</strong>{" "}
                          <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            {data.url}
                          </a>
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Scraped:</strong> {new Date(data.timestamp).toLocaleString()}
                        </p>
                        <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                          <p className="text-sm">{data.content.substring(0, 500)}...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No medical data scraped yet. Use the Scrape URLs or Search tabs to gather information.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalDataScraper;