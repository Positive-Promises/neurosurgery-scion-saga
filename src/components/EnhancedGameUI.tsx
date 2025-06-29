
import React, { useState } from 'react';
import { Pause, Play, X, Volume2, VolumeX, Accessibility, Settings } from 'lucide-react';
import MedicalCard from '@/components/ui/medical-card';
import MedicalButton from '@/components/ui/medical-button';
import MedicalProgress from '@/components/ui/medical-progress';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import { useEnhancedAudio } from '@/hooks/useEnhancedAudio';

interface EnhancedGameUIProps {
  level: {
    id: number;
    title: string;
    objectives: string[];
  };
  score: number;
  progress: number;
  gameState: 'playing' | 'paused' | 'completed';
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
}

const EnhancedGameUI: React.FC<EnhancedGameUIProps> = ({
  level,
  score,
  progress,
  gameState,
  onPause,
  onResume,
  onExit
}) => {
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const {
    isEnabled,
    toggleAudio,
    playMedicalAudio,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
    accessibilitySettings,
    updateAccessibilitySettings
  } = useEnhancedAudio();

  const handleButtonClick = (action: () => void) => {
    playMedicalAudio('success-chime', {
      accessibleDescription: 'Button activated'
    });
    action();
  };

  const handleVolumeChange = (type: 'music' | 'sfx', volume: number) => {
    if (type === 'music') {
      setMusicVolume(volume);
    } else {
      setSfxVolume(volume);
    }
  };

  return (
    <>
      {/* Top HUD with Glassmorphism */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <MedicalCard className="p-4" variant="primary">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-white font-bold text-xl mb-2" role="heading" aria-level={1}>
                {level.title}
              </h2>
              <div className="flex items-center gap-6">
                <div className="text-cyan-400 font-semibold" aria-live="polite">
                  Score: {score.toLocaleString()}
                </div>
                <div className="flex-1 max-w-md">
                  <MedicalProgress
                    value={progress}
                    variant="primary"
                    label="Level Progress"
                    aria-label={`Level progress: ${Math.round(progress)}% complete`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <MedicalButton
                variant="secondary"
                size="sm"
                onClick={() => handleButtonClick(() => setShowAccessibilityPanel(true))}
                aria-label="Open accessibility settings"
                role="button"
              >
                <Accessibility className="h-4 w-4" />
              </MedicalButton>
              
              <MedicalButton
                variant="secondary"
                size="sm"
                onClick={() => handleButtonClick(toggleAudio)}
                aria-label={isEnabled ? "Mute audio" : "Enable audio"}
                role="button"
              >
                {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </MedicalButton>
              
              <MedicalButton
                variant="diagnostic"
                size="sm"
                onClick={() => handleButtonClick(gameState === 'playing' ? onPause : onResume)}
                aria-label={gameState === 'playing' ? "Pause game" : "Resume game"}
                role="button"
              >
                {gameState === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </MedicalButton>

              <MedicalButton
                variant="surgical"
                size="sm"
                onClick={() => handleButtonClick(onExit)}
                aria-label="Exit game"
                role="button"
              >
                <X className="h-4 w-4" />
              </MedicalButton>
            </div>
          </div>
        </MedicalCard>
      </div>

      {/* Objectives Panel with Enhanced Glassmorphism */}
      <div className="absolute left-4 top-24 bottom-4 w-80 z-10">
        <MedicalCard className="p-4 h-full" variant="diagnostic">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2" role="heading" aria-level={2}>
            <Settings className="w-5 h-5" />
            Learning Objectives
          </h3>
          <div className="space-y-3" role="list" aria-label="Learning objectives">
            {level.objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3" role="listitem">
                <div className="w-5 h-5 rounded-full border-2 border-cyan-400 mt-0.5 flex-shrink-0 bg-cyan-400/20 backdrop-blur-sm">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400/50 to-blue-400/50" />
                </div>
                <span className="text-gray-200 text-sm leading-relaxed">
                  {objective}
                </span>
              </div>
            ))}
          </div>
          
          {/* Medical Context Information */}
          <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white/90 font-medium mb-2">Medical Context</h4>
            <p className="text-white/70 text-xs">
              This simulation focuses on neuroanatomical structures essential for neurosurgical practice.
            </p>
          </div>
        </MedicalCard>
      </div>

      {/* Enhanced Pause Overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-20">
          <div className="relative">
            <MedicalCard className="p-8 text-center max-w-md" variant="primary">
              <h2 className="text-3xl font-bold text-white mb-6" role="heading" aria-level={1}>
                Game Paused
              </h2>
              <p className="text-white/80 mb-6">
                Take your time to review the learning objectives or adjust your settings.
              </p>
              <div className="flex gap-4 justify-center">
                <MedicalButton 
                  onClick={() => handleButtonClick(onResume)}
                  variant="primary"
                  aria-label="Resume game"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </MedicalButton>
                <MedicalButton 
                  variant="secondary" 
                  onClick={() => handleButtonClick(onExit)}
                  aria-label="Exit to main menu"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit to Menu
                </MedicalButton>
              </div>
            </MedicalCard>
          </div>
        </div>
      )}

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
        accessibilitySettings={accessibilitySettings}
        onSettingsChange={updateAccessibilitySettings}
        audioEnabled={isEnabled}
        onToggleAudio={toggleAudio}
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onVolumeChange={handleVolumeChange}
      />

      {/* Screen Reader Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {gameState === 'paused' && "Game paused. Press resume to continue."}
        {gameState === 'playing' && "Game in progress."}
        {gameState === 'completed' && "Level completed successfully!"}
      </div>
    </>
  );
};

export default EnhancedGameUI;
