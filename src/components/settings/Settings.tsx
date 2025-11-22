import { useState } from 'react';
import { useSettings } from '../../hooks/use-settings';
import { Button } from '../ui/Button';
import { Key, Save, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Settings() {
    const { apiKey, saveApiKey, removeApiKey, isInitialized } = useSettings();
    const [inputKey, setInputKey] = useState(apiKey);

    const handleSave = () => {
        if (inputKey.trim()) {
            saveApiKey(inputKey.trim());
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your API keys and application preferences.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Key size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Google Gemini API Key</h3>
                        <p className="text-sm text-muted-foreground">
                            Required for generating text and images. Your key is stored locally in your browser.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="Enter your API Key (AIza...)"
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        {isInitialized && (
                            <div className="absolute right-3 top-3 text-green-500">
                                <CheckCircle size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={handleSave} disabled={!inputKey}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Key
                        </Button>
                        {isInitialized && (
                            <Button variant="destructive" onClick={removeApiKey}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Key
                            </Button>
                        )}
                    </div>

                    {!isInitialized && (
                        <div className="flex items-center gap-2 text-amber-500 text-sm bg-amber-500/10 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            <span>You need to set an API key to use the generators.</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-sm text-muted-foreground">
                    Social SEO Content Generator v1.0.0 <br />
                    Powered by Google Gemini & Imagen.
                </p>
            </div>
        </div>
    );
}
