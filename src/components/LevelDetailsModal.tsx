
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Gamepad2, X } from 'lucide-react';

interface LevelDetailsModalProps {
  level: {
    id: number;
    title: string;
    subtitle: string;
    difficulty: string;
    description: string;
    objectives: string[];
    surgicalFocus: string;
    xp: number;
    estimatedTime: string;
  } | null;
  isVisible: boolean;
  onClose: () => void;
  onStartLevel: () => void;
}

const LevelDetailsModal: React.FC<LevelDetailsModalProps> = ({ 
  level, 
  isVisible, 
  onClose, 
  onStartLevel 
}) => {
  if (!level || !isVisible) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Resident': return 'bg-green-500';
      case 'Chief Resident': return 'bg-yellow-500';
      case 'Fellow': return 'bg-orange-500';
      case 'Attending': return 'bg-red-500';
      case 'Expert': return 'bg-purple-500';
      case 'Master Surgeon': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full bg-slate-800/95 backdrop-blur-sm border-blue-500 animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
          <CardTitle className="text-white text-2xl flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            {level.title}
          </CardTitle>
          <p className="text-blue-300 text-lg">{level.subtitle}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-300">{level.description}</p>
          
          <div>
            <h4 className="text-white font-semibold mb-2">Learning Objectives:</h4>
            <ul className="space-y-1">
              {level.objectives.map((objective, index) => (
                <li key={index} className="text-gray-300 flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-700/50 backdrop-blur-sm p-3 rounded-lg">
            <h4 className="text-cyan-400 font-semibold mb-1">Surgical Focus:</h4>
            <p className="text-gray-300 text-sm">{level.surgicalFocus}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-600">
            <div className="flex items-center gap-4">
              <Badge className={`${getDifficultyColor(level.difficulty)} text-white`}>
                {level.difficulty}
              </Badge>
              <span className="text-cyan-400 font-semibold">+{level.xp} XP</span>
              <span className="text-gray-400">{level.estimatedTime}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              onClick={onStartLevel}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Enter Operating Room
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelDetailsModal;
