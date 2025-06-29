
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import MedicalCard from '@/components/ui/medical-card';
import MedicalButton from '@/components/ui/medical-button';
import { Accessibility, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accessibilitySettings: {
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    subtitles: boolean;
    audioDescriptions: boolean;
  };
  onSettingsChange: (settings: any) => void;
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <MedicalCard className="w-full max-w-md p-6 max-h-[80vh] overflow-y-auto" variant="primary">
        <div className="flex items-center gap-3 mb-6">
          <Accessibility className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Accessibility Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Audio Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Audio Controls
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-toggle" className="text-white/80">
                  Enable Audio
                </Label>
                <Checkbox
                  id="audio-toggle"
                  checked={audioEnabled}
                  onCheckedChange={onToggleAudio}
                  aria-label="Toggle audio on/off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="music-volume" className="text-white/80">
                  Music Volume: {Math.round(musicVolume * 100)}%
                </Label>
                <input
                  id="music-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                  onChange={(e) => onVolumeChange('music', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  aria-label="Adjust music volume"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sfx-volume" className="text-white/80">
                  Sound Effects: {Math.round(sfxVolume * 100)}%
                </Label>
                <input
                  id="sfx-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={sfxVolume}
                  onChange={(e) => onVolumeChange('sfx', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  aria-label="Adjust sound effects volume"
                />
              </div>
            </div>
          </div>

          {/* Visual Accessibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visual Accessibility
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="text-white/80">
                  Reduce Motion
                </Label>
                <Checkbox
                  id="reduced-motion"
                  checked={accessibilitySettings.reducedMotion}
                  onCheckedChange={(checked) => onSettingsChange({ reducedMotion: checked })}
                  aria-label="Reduce animations and motion"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-white/80">
                  High Contrast
                </Label>
                <Checkbox
                  id="high-contrast"
                  checked={accessibilitySettings.highContrast}
                  onCheckedChange={(checked) => onSettingsChange({ highContrast: checked })}
                  aria-label="Enable high contrast mode"
                />
              </div>
            </div>
          </div>

          {/* Audio Descriptions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Audio Descriptions</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader" className="text-white/80">
                  Screen Reader Support
                </Label>
                <Checkbox
                  id="screen-reader"
                  checked={accessibilitySettings.screenReader}
                  onCheckedChange={(checked) => onSettingsChange({ screenReader: checked })}
                  aria-label="Enable screen reader support"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="subtitles" className="text-white/80">
                  Subtitles
                </Label>
                <Checkbox
                  id="subtitles"
                  checked={accessibilitySettings.subtitles}
                  onCheckedChange={(checked) => onSettingsChange({ subtitles: checked })}
                  aria-label="Enable subtitles"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="audio-descriptions" className="text-white/80">
                  Audio Descriptions
                </Label>
                <Checkbox
                  id="audio-descriptions"
                  checked={accessibilitySettings.audioDescriptions}
                  onCheckedChange={(checked) => onSettingsChange({ audioDescriptions: checked })}
                  aria-label="Enable audio descriptions"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <MedicalButton
            onClick={onClose}
            variant="primary"
            aria-label="Close accessibility settings"
          >
            Close
          </MedicalButton>
        </div>
      </MedicalCard>
    </div>
  );
};

export default AccessibilityPanel;
