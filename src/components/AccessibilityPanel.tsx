
import React from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import MedicalCard from '@/components/ui/medical-card';
import MedicalButton from '@/components/ui/medical-button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  subtitles: boolean;
  audioDescriptions: boolean;
}

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accessibilitySettings: AccessibilitySettings;
  onSettingsChange: (settings: Partial<AccessibilitySettings>) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  musicVolume: number;
  sfxVolume: number;
  onVolumeChange: (type: 'music' | 'sfx', volume: number) => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
  accessibilitySettings,
  onSettingsChange,
  audioEnabled,
  onToggleAudio,
  musicVolume,
  sfxVolume,
  onVolumeChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50">
      <MedicalCard className="p-6 max-w-md w-full mx-4" variant="primary">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Accessibility Settings</h2>
          <MedicalButton
            variant="secondary"
            size="sm"
            onClick={onClose}
            aria-label="Close accessibility panel"
          >
            <X className="h-4 w-4" />
          </MedicalButton>
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Audio Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80">Enable Audio</span>
              <Switch checked={audioEnabled} onCheckedChange={onToggleAudio} />
            </div>

            {audioEnabled && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/80">Music Volume</span>
                    <span className="text-white/60">{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <Slider
                    value={[musicVolume * 100]}
                    onValueChange={(value) => onVolumeChange('music', value[0] / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/80">Sound Effects</span>
                    <span className="text-white/60">{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <Slider
                    value={[sfxVolume * 100]}
                    onValueChange={(value) => onVolumeChange('sfx', value[0] / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Visual Settings</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80">Reduced Motion</span>
              <Switch 
                checked={accessibilitySettings.reducedMotion}
                onCheckedChange={(checked) => onSettingsChange({ reducedMotion: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/80">High Contrast</span>
              <Switch 
                checked={accessibilitySettings.highContrast}
                onCheckedChange={(checked) => onSettingsChange({ highContrast: checked })}
              />
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Accessibility Features</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80">Screen Reader Support</span>
              <Switch 
                checked={accessibilitySettings.screenReader}
                onCheckedChange={(checked) => onSettingsChange({ screenReader: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/80">Subtitles</span>
              <Switch 
                checked={accessibilitySettings.subtitles}
                onCheckedChange={(checked) => onSettingsChange({ subtitles: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/80">Audio Descriptions</span>
              <Switch 
                checked={accessibilitySettings.audioDescriptions}
                onCheckedChange={(checked) => onSettingsChange({ audioDescriptions: checked })}
              />
            </div>
          </div>
        </div>
      </MedicalCard>
    </div>
  );
};

export default AccessibilityPanel;
