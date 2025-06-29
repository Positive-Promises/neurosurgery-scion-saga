
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Trophy, Lock, Play, BookOpen, Gamepad2, Stethoscope } from 'lucide-react';

const GAME_LEVELS = [
  {
    id: 1,
    title: "Neuroanatomical Foundations",
    subtitle: "Master Surgical Anatomy of the CNS",
    difficulty: "Resident",
    locked: false,
    completed: false,
    description: "Navigate through the fundamental neuroanatomical structures essential for neurosurgical practice. Master cranial anatomy, ventricular system, and vascular territories critical for surgical planning.",
    objectives: [
      "Identify surgical landmarks and anatomical planes", 
      "Master cranial base anatomy and foramina", 
      "Understand CSF circulation and hydrocephalus pathophysiology",
      "Learn arterial territories and watershed zones"
    ],
    boss: "Hydrocephalus Crisis",
    xp: 150,
    estimatedTime: "60 min",
    surgicalFocus: "Cranial base approaches, ventricular anatomy"
  },
  {
    id: 2,
    title: "Spinal Neurosurgeon",
    subtitle: "Master Vertebral Column & Spinal Cord",
    difficulty: "Resident",
    locked: true,
    completed: false,
    description: "Perform complex spinal procedures while mastering spinal cord anatomy, nerve root pathways, and surgical approaches. Handle spinal trauma, degenerative disease, and tumor resections.",
    objectives: [
      "Execute posterior and anterior cervical approaches", 
      "Master thoracolumbar instrumentation techniques", 
      "Understand spinal cord tracts and clinical correlations",
      "Perform microsurgical decompression procedures"
    ],
    boss: "Cervical Myelopathy Syndrome",
    xp: 200,
    estimatedTime: "90 min",
    surgicalFocus: "Laminectomy, discectomy, fusion techniques"
  },
  {
    id: 3,
    title: "Brainstem Microsurgery",
    subtitle: "Navigate the Surgical Danger Zone",
    difficulty: "Chief Resident",
    locked: true,
    completed: false,
    description: "Master the most challenging area of neurosurgery. Perform brainstem procedures while preserving vital functions. Navigate cranial nerve complexes and handle brainstem pathology.",
    objectives: [
      "Master cranial nerve surgical anatomy (III-XII)", 
      "Perform retrosigmoid and pterional approaches", 
      "Handle brainstem gliomas and cavernomas",
      "Execute microvascular decompression procedures"
    ],
    boss: "Acoustic Neuroma Complex",
    xp: 300,
    estimatedTime: "120 min",
    surgicalFocus: "Skull base surgery, cranial nerve preservation"
  },
  {
    id: 4,
    title: "Cerebellar Surgery Specialist",
    subtitle: "Master Posterior Fossa Procedures",
    difficulty: "Chief Resident",
    locked: true,
    completed: false,
    description: "Navigate the posterior fossa with precision. Master cerebellar anatomy, handle Chiari malformations, and perform complex tumor resections while preserving motor function.",
    objectives: [
      "Execute suboccipital craniotomy techniques", 
      "Master cerebellar peduncle anatomy", 
      "Handle Chiari I & II malformations surgically",
      "Perform cerebellar tumor resections"
    ],
    boss: "Chiari Malformation Crisis",
    xp: 350,
    estimatedTime: "105 min",
    surgicalFocus: "Posterior fossa decompression, tumor resection"
  },
  {
    id: 5,
    title: "Deep Brain Surgery",
    subtitle: "Master Subcortical Procedures",
    difficulty: "Fellow",
    locked: true,
    completed: false,
    description: "Perform stereotactic procedures and deep brain stimulation. Navigate thalamic nuclei, handle movement disorders, and master functional neurosurgery techniques.",
    objectives: [
      "Master stereotactic frame placement and targeting", 
      "Perform DBS electrode implantation", 
      "Handle thalamic and hypothalamic lesions",
      "Execute functional disconnection procedures"
    ],
    boss: "Parkinson's Tremor Storm",
    xp: 400,
    estimatedTime: "135 min",
    surgicalFocus: "Stereotactic surgery, DBS, functional procedures"
  },
  {
    id: 6,
    title: "Cerebral Cortex Mastery",
    subtitle: "Advanced Cortical Resections",
    difficulty: "Fellow",
    locked: true,
    completed: false,
    description: "Master awake craniotomy techniques and eloquent area surgery. Perform temporal lobectomy, hemispherectomy, and complex epilepsy procedures while preserving function.",
    objectives: [
      "Execute awake craniotomy with cortical mapping", 
      "Master temporal lobe anatomy and amygdalohippocampectomy", 
      "Perform functional cortical resections",
      "Handle arteriovenous malformation resections"
    ],
    boss: "Eloquent Area Glioblastoma",
    xp: 500,
    estimatedTime: "150 min",
    surgicalFocus: "Awake surgery, cortical mapping, epilepsy surgery"
  },
  {
    id: 7,
    title: "Vascular Neurosurgery",
    subtitle: "Master Cerebrovascular Procedures",
    difficulty: "Attending",
    locked: true,
    completed: false,
    description: "Handle complex aneurysms, AVMs, and stroke interventions. Master microsurgical clipping, bypass procedures, and endovascular techniques.",
    objectives: [
      "Perform aneurysm clipping via multiple approaches", 
      "Execute EC-IC bypass procedures", 
      "Handle arteriovenous malformation resections",
      "Master carotid endarterectomy techniques"
    ],
    boss: "Ruptured Giant Aneurysm",
    xp: 600,
    estimatedTime: "180 min",
    surgicalFocus: "Aneurysm surgery, bypass, AVM resection"
  },
  {
    id: 8,
    title: "Neuro-Oncology Specialist",
    subtitle: "Master Complex Tumor Surgery",
    difficulty: "Attending",
    locked: true,
    completed: false,
    description: "Perform complex brain tumor resections using advanced techniques. Handle glioblastomas, meningiomas, and skull base tumors with maximal safe resection principles.",
    objectives: [
      "Execute gross total resection of high-grade gliomas", 
      "Perform skull base meningioma resections", 
      "Master intraoperative neuromonitoring",
      "Handle pediatric brain tumor complexities"
    ],
    boss: "Glioblastoma Multiforme",
    xp: 700,
    estimatedTime: "200 min",
    surgicalFocus: "Tumor resection, skull base surgery, pediatric cases"
  },
  {
    id: 9,
    title: "Trauma Neurosurgery",
    subtitle: "Emergency Neurosurgical Procedures",
    difficulty: "Expert",
    locked: true,
    completed: false,
    description: "Handle neurosurgical emergencies and complex trauma cases. Master ICP management, perform emergency craniotomies, and handle polytrauma scenarios.",
    objectives: [
      "Execute emergency decompressive craniotomy", 
      "Master ICP monitoring and management", 
      "Handle penetrating brain injury cases",
      "Perform emergency spine stabilization"
    ],
    boss: "Polytrauma with Raised ICP",
    xp: 800,
    estimatedTime: "240 min",
    surgicalFocus: "Emergency procedures, ICP management, trauma"
  },
  {
    id: 10,
    title: "Neurosurgical Scion",
    subtitle: "Master of All Neurosurgical Arts",
    difficulty: "Master Surgeon",
    locked: true,
    completed: false,
    description: "The ultimate test combining all neurosurgical subspecialties. Handle the most complex cases requiring mastery of all previous levels. Demonstrate complete neurosurgical expertise.",
    objectives: [
      "Perform combined approaches for complex pathology", 
      "Master all neurosurgical subspecialties", 
      "Handle rare and complex case presentations",
      "Demonstrate teaching and leadership skills"
    ],
    boss: "The Ultimate Neurosurgical Challenge",
    xp: 1000,
    estimatedTime: "300 min",
    surgicalFocus: "Multi-specialty mastery, complex cases, innovation"
  }
];

const NeurosurgicalScion = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    totalXP: 0,
    level: 1,
    completedLevels: 0,
    achievements: [],
    surgicalRank: "Medical Student"
  });
  const [showLevelDetails, setShowLevelDetails] = useState(false);

  const getDifficultyColor = (difficulty) => {
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

  const calculateProgress = () => {
    return (playerStats.completedLevels / GAME_LEVELS.length) * 100;
  };

  const getSurgicalRank = () => {
    if (playerStats.totalXP >= 4000) return "Master Neurosurgeon";
    if (playerStats.totalXP >= 3000) return "Attending Neurosurgeon";
    if (playerStats.totalXP >= 2000) return "Neurosurgery Fellow";
    if (playerStats.totalXP >= 1000) return "Chief Resident";
    if (playerStats.totalXP >= 500) return "Senior Resident";
    if (playerStats.totalXP >= 100) return "Junior Resident";
    return "Medical Student";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Enhanced Medical Background */}
      <div className="fixed inset-0 opacity-15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.4),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4">
              NEUROSURGICAL SCION
            </h1>
            <p className="text-xl text-gray-300 mb-6">Master the Art and Science of Neurosurgery</p>
            
            {/* Enhanced Player Stats */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-cyan-400" />
                <span className="text-white font-semibold">{getSurgicalRank()}</span>
              </div>
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
                <span className="text-white font-semibold">{playerStats.completedLevels}/{GAME_LEVELS.length} Cases</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <Progress value={calculateProgress()} className="h-3 bg-gray-700" />
              <p className="text-sm text-gray-400 mt-2">Surgical Mastery Progress: {Math.round(calculateProgress())}%</p>
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
                      : 'bg-blue-900/50 border-blue-500 hover:bg-blue-800/50'
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
                    <Brain className="w-5 h-5 text-cyan-400" />
                    Case {level.id}
                  </CardTitle>
                  <div>
                    <h3 className="text-blue-300 font-semibold">{level.title}</h3>
                    <p className="text-gray-400 text-sm">{level.subtitle}</p>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-400 text-sm font-semibold">+{level.xp} XP</span>
                      <span className="text-gray-400 text-sm">{level.estimatedTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Challenge: {level.boss}</span>
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      Focus: {level.surgicalFocus}
                    </div>

                    {!level.locked && (
                      <Button 
                        className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLevel(level);
                          setShowLevelDetails(true);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {level.completed ? 'Review Case' : 'Begin Surgery'}
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
              <Card className="max-w-3xl w-full bg-slate-800 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    <Brain className="w-8 h-8 text-cyan-400" />
                    {selectedLevel.title}
                  </CardTitle>
                  <p className="text-blue-300 text-lg">{selectedLevel.subtitle}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{selectedLevel.description}</p>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Learning Objectives:</h4>
                    <ul className="space-y-1">
                      {selectedLevel.objectives.map((objective, index) => (
                        <li key={index} className="text-gray-300 flex items-start gap-2">
                          <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <h4 className="text-cyan-400 font-semibold mb-1">Surgical Focus:</h4>
                    <p className="text-gray-300 text-sm">{selectedLevel.surgicalFocus}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-4">
                      <Badge className={`${getDifficultyColor(selectedLevel.difficulty)} text-white`}>
                        {selectedLevel.difficulty}
                      </Badge>
                      <span className="text-cyan-400 font-semibold">+{selectedLevel.xp} XP</span>
                      <span className="text-gray-400">{selectedLevel.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      onClick={() => {
                        console.log(`Launching surgical case: ${selectedLevel.title}...`);
                      }}
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Enter Operating Room
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

export default NeurosurgicalScion;
