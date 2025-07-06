import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MedicalDataScraper from '@/components/MedicalDataScraper';

const MedicalScraper: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Medical Data Scraper</h1>
          <Link to="/">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
          </Link>
        </div>
        
        <MedicalDataScraper />
      </div>
    </div>
  );
};

export default MedicalScraper;