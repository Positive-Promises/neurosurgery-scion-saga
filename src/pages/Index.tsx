
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Trophy, Lock, Play, BookOpen, Gamepad2 } from 'lucide-react';

const GAME_LEVELS = [
  {
    id: 1,
    title: "Neuroanatomy Foundations",
    subtitle: "Master the Basic Architecture",
    difficulty: "Beginner",
    locked: false,
    completed: false,
    description: "Explore the fundamental structures of the nervous system. Navigate through neurons, understand cell types, and master basic terminology.",
    objectives: ["Identify major brain regions", "Understand neuron structure", "Learn basic neuroanatomy terms"],
    boss: "The Myelin Destroyer",
    xp: 100,
    estimatedTime: "45 min"
  },
  {
    id: 2,
    title: "Spinal Cord Warrior",
    subtitle: "Descend into the Neural Highway",
    difficulty: "Beginner",
    locked: true,
    completed: false,
    description: "Journey through the spinal cord's intricate pathways. Master ascending and descending tracts while battling spinal injuries.",
    objectives: ["Map spinal segments", "Trace sensory pathways", "Understand motor control"],
    boss: "Compression Syndrome",
    xp: 150,
    estimatedTime: "60 min"
  },
  {
    id: 3,
    title: "Brainstem Battleground",
    subtitle: "Control the Vital Centers",
    difficulty: "Intermediate",
    locked: true,
    completed: false,
    description: "Navigate the life-sustaining brainstem. Control breathing, consciousness, and cranial nerve functions in this critical zone.",
    objectives: ["Master cranial nerves", "Control vital functions", "Navigate reticular formation"],
    boss: "The Coma Inducer",
    xp: 200,
    estimatedTime: "75 min"
  },
  {
    id: 4,
    title: "Cerebellum Precision",
    subtitle: "Master Balance & Coordination",
    difficulty: "Intermediate",
    locked: true,
    completed: false,
    description: "Enter the cerebellum's precise world. Master motor learning, balance, and coordination through challenging obstacle courses.",
    objectives: ["Perfect motor control", "Master balance systems", "Understand cerebellar circuits"],
    boss: "Ataxia Storm",
    xp: 250,
    estimatedTime: "90 min"
  },
  {
    id: 5,
    title: "Diencephalon Depths",
    subtitle: "Command the Neural Relay Station",
    difficulty: "Advanced",
    locked: true,
    completed: false,
    description: "Infiltrate the thalamus and hypothalamus. Control sensory gating, hormonal systems, and consciousness levels.",
    objectives: ["Master thalamic nuclei", "Control hypothalamic functions", "Regulate circadian rhythms"],
    boss: "Hormonal Chaos Entity",
    xp: 300,
    estimatedTime: "105 min"
  },
  {
    id: 6,
    title: "Cerebral Cortex Conquest",
    subtitle: "Rule the Thinking Machine",
    difficulty: "Advanced",
    locked: true,
    completed: false,
    description: "Ascend to the cortical throne. Master higher cognitive functions, language, and executive control in the brain's most complex region.",
    objectives: ["Navigate cortical areas", "Master language centers", "Control executive functions"],
    boss: "The Dementia Overlord",
    xp: 400,
    estimatedTime: "120 min"
  },
  {
    id: 7,
    title: "Limbic System Labyrinth",
    subtitle: "Navigate Emotion & Memory",
    difficulty: "Expert",
    locked: true,
    completed: false,
    description: "Traverse the emotional brain. Master memory formation, emotional regulation, and motivational systems.",
    objectives: ["Form and retrieve memories", "Regulate emotions", "Control motivation"],
    boss: "PTSD Shadow Beast",
    xp: 450,
    estimatedTime: "135 min"
  },
  {
    id: 8,
    title: "Neural Networks Nexus",
    subtitle: "Connect the Neural Web",
    difficulty: "Expert",
    locked: true,
    completed: false,
    description: "Master complex neural circuits. Understand how different brain regions communicate and create consciousness.",
    objectives: ["Map neural networks", "Understand consciousness", "Master neural plasticity"],
    boss: "The Disconnection Syndrome",
    xp: 500,
    estimatedTime: "150 min"
  },
  {
    id: 9,
    title: "Pathology Pandemonium",
    subtitle: "Battle Neurological Diseases",
    difficulty: "Master",
    locked: true,
    completed: false,
    description: "Face the ultimate challenge. Battle against major neurological diseases and master diagnostic skills.",
    objectives: ["Diagnose diseases", "Plan treatments", "Understand pathophysiology"],
    boss: "The Disease Coalition",
    xp: 600,
    estimatedTime: "180 min"
  },
  {
    id: 10,
    title: "Neural Surgeon Supreme",
    subtitle: "The Ultimate CNS Mastery",
    difficulty: "Legendary",
    locked: true,
    completed: false,
    description: "The final test. Perform complex neurosurgical procedures and demonstrate complete mastery of the central nervous system.",
    objectives: ["Master surgical techniques", "Handle complications", "Achieve surgical precision"],
    boss: "The Fracture Fury Titan",
    xp: 1000,
    estimatedTime: "240 min"
  }
];

const FractureFury = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    totalXP: 0,
    level: 1,
    completedLevels: 0,
    achievements: []
  });
  const [showLevelDetails, setShowLevelDetails] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      case 'Master': return 'bg-purple-500';
      case 'Legendary': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateProgress = () => {
    return (playerStats.completedLevels / GAME_LEVELS.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4">
              FRACTURE FURY
            </h1>
            <p className="text-xl text-gray-300 mb-6">Master the Central Nervous System Through Epic Combat</p>
            
            {/* Player Stats */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-white font-semibold">Level {playerStats.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-500" />
                <span className="text-white font-semibold">{playerStats.totalXP} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-green-500" />
                <span className="text-white font-semibold">{playerStats.completedLevels}/{GAME_LEVELS.length} Completed</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <Progress value={calculateProgress()} className="h-3 bg-gray-700" />
              <p className="text-sm text-gray-400 mt-2">Overall Progress: {Math.round(calculateProgress())}%</p>
            </div>
          </div>

          {/* Game Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {GAME_LEVELS.map((level) => (
              <Card 
                key={level.id} 
                className={`relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
                  level.locked 
                    ? 'bg-gray-800/50 border-gray-600' 
                    : level.completed 
                      ? 'bg-green-900/50 border-green-500' 
                      : 'bg-purple-900/50 border-purple-500 hover:bg-purple-800/50'
                }`}
                onClick={() => !level.locked && setSelectedLevel(level)}
              >
                {/* Difficulty Badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(level.difficulty)}`}>
                  {level.difficulty}
                </div>

                {/* Lock Overlay */}
                {level.locked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-pink-500" />
                    Level {level.id}
                  </CardTitle>
                  <div>
                    <h3 className="text-purple-300 font-semibold">{level.title}</h3>
                    <p className="text-gray-400 text-sm">{level.subtitle}</p>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 text-sm font-semibold">+{level.xp} XP</span>
                      <span className="text-gray-400 text-sm">{level.estimatedTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Boss: {level.boss}</span>
                    </div>

                    {!level.locked && (
                      <Button 
                        className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLevel(level);
                          setShowLevelDetails(true);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {level.completed ? 'Replay' : 'Enter'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Level Details Modal */}
          {selectedLevel && showLevelDetails && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <Card className="max-w-2xl w-full bg-slate-800 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    <Brain className="w-8 h-8 text-pink-500" />
                    {selectedLevel.title}
                  </CardTitle>
                  <p className="text-purple-300 text-lg">{selectedLevel.subtitle}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{selectedLevel.description}</p>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Mission Objectives:</h4>
                    <ul className="space-y-1">
                      {selectedLevel.objectives.map((objective, index) => (
                        <li key={index} className="text-gray-300 flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-500" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-4">
                      <Badge className={`${getDifficultyColor(selectedLevel.difficulty)} text-white`}>
                        {selectedLevel.difficulty}
                      </Badge>
                      <span className="text-blue-400 font-semibold">+{selectedLevel.xp} XP</span>
                      <span className="text-gray-400">{selectedLevel.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => {
                        // Here you would launch the actual game level
                        console.log(`Launching ${selectedLevel.title}...`);
                      }}
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Start Mission
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedLevel(null);
                        setShowLevelDetails(false);
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FractureFury;
