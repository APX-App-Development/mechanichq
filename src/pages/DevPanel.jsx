import React, { useState, useEffect } from 'react';
import { useDevMode } from '@/components/DevModeProvider';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Code, 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw,
  Shield,
  Palette,
  Database,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function DevPanel() {
  const { isDevMode, disableDevMode } = useDevMode();
  const navigate = useNavigate();
  
  const [featureFlags, setFeatureFlags] = useState(() => {
    const stored = localStorage.getItem('featureFlags');
    return stored ? JSON.parse(stored) : {
      catalog: false,
      myGarage: true,
      myJobs: true,
      partsList: true,
      searchHistory: true,
      home: true
    };
  });

  const [appSettings, setAppSettings] = useState(() => {
    const stored = localStorage.getItem('appSettings');
    return stored ? JSON.parse(stored) : {
      appName: 'MechanicHQ',
      tagline: 'OEM Parts + Pro Instructions in Seconds',
      maintenanceMode: false,
      allowNewUsers: true,
      maxSearchResults: 10
    };
  });

  const [devNotes, setDevNotes] = useState(() => {
    return localStorage.getItem('devNotes') || '';
  });

  useEffect(() => {
    if (!isDevMode) {
      navigate(createPageUrl('Home'));
    }
  }, [isDevMode]);

  const handleFeatureToggle = (feature) => {
    const newFlags = { ...featureFlags, [feature]: !featureFlags[feature] };
    setFeatureFlags(newFlags);
    localStorage.setItem('featureFlags', JSON.stringify(newFlags));
    toast.success(`${feature} ${newFlags[feature] ? 'enabled' : 'disabled'}`);
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...appSettings, [key]: value };
    setAppSettings(newSettings);
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    toast.success('Settings saved successfully!');
  };

  const resetSettings = () => {
    const defaultSettings = {
      appName: 'MechanicHQ',
      tagline: 'OEM Parts + Pro Instructions in Seconds',
      maintenanceMode: false,
      allowNewUsers: true,
      maxSearchResults: 10
    };
    setAppSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    toast.success('Settings reset to defaults');
  };

  const saveDevNotes = () => {
    localStorage.setItem('devNotes', devNotes);
    toast.success('Dev notes saved!');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure? This will clear all localStorage data except dev mode.')) {
      const devMode = localStorage.getItem('devMode');
      localStorage.clear();
      localStorage.setItem('devMode', devMode);
      window.location.reload();
    }
  };

  const features = [
    { id: 'home', name: 'Home Page', icon: Sparkles, description: 'Main landing page with search' },
    { id: 'catalog', name: 'Parts Catalog', icon: Database, description: 'Browse parts by category' },
    { id: 'myGarage', name: 'My Garage', icon: Settings, description: 'Vehicle management' },
    { id: 'myJobs', name: 'My Jobs', icon: Settings, description: 'Job tracking and planning' },
    { id: 'partsList', name: 'Parts List', icon: Settings, description: 'Saved parts collection' },
    { id: 'searchHistory', name: 'Search History', icon: Clock, description: 'Past searches' }
  ];

  if (!isDevMode) return null;

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-orange-500 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-orange-500" />
                <h1 className="text-3xl font-bold text-white">Developer Control Panel</h1>
                <Badge className="bg-orange-500 text-white">
                  <Code className="w-3 h-3 mr-1" />
                  Admin Access
                </Badge>
              </div>
              <p className="text-gray-400">Manage features, settings, and app configuration</p>
            </div>
            <Button
              onClick={disableDevMode}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              Exit Dev Mode
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="bg-[#1a1a1a] border border-[#333]">
            <TabsTrigger value="features">Feature Flags</TabsTrigger>
            <TabsTrigger value="settings">App Settings</TabsTrigger>
            <TabsTrigger value="notes">Dev Notes</TabsTrigger>
            <TabsTrigger value="tools">Dev Tools</TabsTrigger>
          </TabsList>

          {/* Feature Flags */}
          <TabsContent value="features">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-bold text-xl mb-2">Feature Availability</h2>
                <p className="text-gray-400 text-sm">
                  Toggle features on/off. Disabled features show "Coming Soon" to regular users.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#222] border border-[#333] rounded-xl p-5 hover:border-orange-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${featureFlags[feature.id] ? 'bg-green-500/20' : 'bg-gray-500/20'} flex items-center justify-center`}>
                          <feature.icon className={`w-5 h-5 ${featureFlags[feature.id] ? 'text-green-500' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{feature.name}</h3>
                          <p className="text-gray-500 text-xs">{feature.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={featureFlags[feature.id]}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {featureFlags[feature.id] ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-500 text-sm font-medium">Available to all users</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-500 text-sm font-medium">Coming Soon (Dev only)</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* App Settings */}
          <TabsContent value="settings">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-bold text-xl mb-2">Application Settings</h2>
                <p className="text-gray-400 text-sm">Configure app-wide settings and behavior</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-white font-medium mb-2 block">App Name</label>
                  <Input
                    value={appSettings.appName}
                    onChange={(e) => handleSettingChange('appName', e.target.value)}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Tagline</label>
                  <Input
                    value={appSettings.tagline}
                    onChange={(e) => handleSettingChange('tagline', e.target.value)}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Max Search Results</label>
                  <Input
                    type="number"
                    value={appSettings.maxSearchResults}
                    onChange={(e) => handleSettingChange('maxSearchResults', parseInt(e.target.value))}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>

                <div className="flex items-center justify-between bg-[#222] border border-[#444] rounded-lg p-4">
                  <div>
                    <h3 className="text-white font-medium">Maintenance Mode</h3>
                    <p className="text-gray-500 text-sm">Show maintenance page to all users</p>
                  </div>
                  <Switch
                    checked={appSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between bg-[#222] border border-[#444] rounded-lg p-4">
                  <div>
                    <h3 className="text-white font-medium">Allow New Users</h3>
                    <p className="text-gray-500 text-sm">Enable user registration</p>
                  </div>
                  <Switch
                    checked={appSettings.allowNewUsers}
                    onCheckedChange={(checked) => handleSettingChange('allowNewUsers', checked)}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#333]">
                  <Button onClick={saveSettings} className="bg-orange-500 hover:bg-orange-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button onClick={resetSettings} variant="outline" className="border-[#444] text-gray-400">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Dev Notes */}
          <TabsContent value="notes">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-bold text-xl mb-2">Developer Notes</h2>
                <p className="text-gray-400 text-sm">Keep track of TODOs, bugs, and development notes</p>
              </div>

              <Textarea
                value={devNotes}
                onChange={(e) => setDevNotes(e.target.value)}
                placeholder="Add your development notes here..."
                className="bg-[#222] border-[#444] text-white min-h-[300px] font-mono text-sm"
              />

              <Button onClick={saveDevNotes} className="bg-orange-500 hover:bg-orange-600 mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </TabsContent>

          {/* Dev Tools */}
          <TabsContent value="tools">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-bold text-xl mb-2">Developer Tools</h2>
                <p className="text-gray-400 text-sm">Advanced tools and utilities</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#222] border border-[#444] rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-2">Local Storage</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Current storage size: {JSON.stringify(localStorage).length} bytes
                  </p>
                  <Button 
                    onClick={clearAllData} 
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>

                <div className="bg-[#222] border border-[#444] rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-2">Dev Mode Secret Code</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Current code: <code className="text-orange-500">dev1234</code>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Change in: components/DevModeProvider.jsx
                  </p>
                </div>

                <div className="bg-[#222] border border-[#444] rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-2">Quick Actions</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline"
                      className="border-[#444] text-gray-300"
                    >
                      Reload App
                    </Button>
                    <Button 
                      onClick={() => console.log('Feature Flags:', featureFlags)} 
                      variant="outline"
                      className="border-[#444] text-gray-300"
                    >
                      Log Feature Flags
                    </Button>
                    <Button 
                      onClick={() => console.log('App Settings:', appSettings)} 
                      variant="outline"
                      className="border-[#444] text-gray-300"
                    >
                      Log Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}