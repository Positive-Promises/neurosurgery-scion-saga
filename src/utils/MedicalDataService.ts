import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface ScrapeSuccessResponse {
  success: true;
  data: {
    title?: string;
    markdown?: string;
    html?: string;
    metadata?: any;
  };
}

type ScrapeResponse = ScrapeSuccessResponse | ErrorResponse;

export class MedicalDataService {
  private static API_KEY_STORAGE_KEY = 'medical_firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('Medical data API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing medical data API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      
      // Test with a simple medical URL
      const testResponse = await this.firecrawlApp.scrapeUrl('https://en.wikipedia.org/wiki/Brain', {
        formats: ['markdown']
      });
      
      return testResponse.success;
    } catch (error) {
      console.error('Error testing medical data API key:', error);
      return false;
    }
  }

  static async scrapeUrl(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making scrape request for medical data:', url);
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const scrapeResponse = await this.firecrawlApp.scrapeUrl(url, {
        formats: ['markdown', 'html'],
        includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'article'],
        excludeTags: ['nav', 'footer', 'aside', 'script', 'style'],
        onlyMainContent: true
      }) as ScrapeResponse;

      if (!scrapeResponse.success) {
        console.error('Medical data scrape failed:', (scrapeResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (scrapeResponse as ErrorResponse).error || 'Failed to scrape medical data' 
        };
      }

      console.log('Medical data scrape successful');
      return { 
        success: true,
        data: (scrapeResponse as ScrapeSuccessResponse).data 
      };
    } catch (error) {
      console.error('Error during medical data scrape:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  static async batchScrapeUrls(urls: string[]): Promise<Array<{ url: string; success: boolean; data?: any; error?: string }>> {
    const results = [];
    
    for (const url of urls) {
      const result = await this.scrapeUrl(url);
      results.push({
        url,
        ...result
      });
      
      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  static async searchMedicalTerm(term: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    const searchUrls = [
      `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(term)}`,
      `https://en.wikipedia.org/wiki/${encodeURIComponent(term.replace(/\s+/g, '_'))}`,
      `https://www.wikibooks.org/wiki/Special:Search?search=${encodeURIComponent(term)}&go=Go`
    ];

    try {
      const results = await this.batchScrapeUrls(searchUrls);
      const successfulResults = results.filter(r => r.success);
      
      return {
        success: true,
        data: successfulResults
      };
    } catch (error) {
      console.error('Error searching medical term:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search medical term'
      };
    }
  }

  // Store scraped medical data locally
  static saveMedicalData(data: any): void {
    const existingData = this.getMedicalData();
    const newData = [...existingData, { ...data, id: Date.now(), timestamp: new Date().toISOString() }];
    localStorage.setItem('medical_scraped_data', JSON.stringify(newData));
  }

  static getMedicalData(): any[] {
    const data = localStorage.getItem('medical_scraped_data');
    return data ? JSON.parse(data) : [];
  }

  static clearMedicalData(): void {
    localStorage.removeItem('medical_scraped_data');
  }

  // Filter medical data by category for the game
  static getMedicalDataByCategory(category: 'anatomy' | 'surgery' | 'neurology' | 'general'): any[] {
    const allData = this.getMedicalData();
    return allData.filter(item => item.category === category);
  }

  // Get random medical fact for educational purposes
  static getRandomMedicalFact(): string | null {
    const allData = this.getMedicalData();
    if (allData.length === 0) return null;
    
    const randomItem = allData[Math.floor(Math.random() * allData.length)];
    const content = randomItem.content || '';
    
    // Extract a sentence that might be educational
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 50);
    return sentences.length > 0 ? sentences[0].trim() + '.' : null;
  }
}