import { useState } from 'react';
import { useSettings } from '../../hooks/use-settings';
import { Button } from '../ui/Button';
import { Key, Trash2, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function Settings() {
    const { apiKeys, saveApiKey, removeApiKey, isInitialized } = useSettings();
    const [inputKey, setInputKey] = useState('');

    const handleSave = () => {
        if (inputKey.trim()) {
            saveApiKey(inputKey.trim());
            setInputKey('');
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
                        <h3 className="text-lg font-semibold">Google Gemini API Keys</h3>
                        <p className="text-sm text-muted-foreground">
                            Add one or more API keys for generating text and images. Multiple keys enable automatic rotation when rate limits are hit. Keys are stored locally in your browser.
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSave();
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={handleSave} disabled={!inputKey.trim()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Key
                        </Button>
                    </div>

                    {apiKeys.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Saved Keys ({apiKeys.length})</p>
                            <div className="space-y-2">
                                {apiKeys.map((key, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border"
                                    >
                                        <div className="flex-1 flex items-center gap-2">
                                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                            <span className="text-sm font-mono text-muted-foreground truncate">
                                                {key.substring(0, 20)}...{key.substring(key.length - 8)}
                                            </span>
                                            {index === 0 && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeApiKey(key)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isInitialized && (
                        <div className="flex items-center gap-2 text-amber-500 text-sm bg-amber-500/10 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            <span>You need to add at least one API key to use the generators.</span>
                        </div>
                    )}

                    {isInitialized && apiKeys.length > 0 && (
                        <div className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 p-3 rounded-lg">
                            <CheckCircle size={16} />
                            <span>
                                {apiKeys.length === 1
                                    ? 'API key configured. If you hit rate limits, add more keys for automatic rotation.'
                                    : `${apiKeys.length} API keys configured. The system will automatically rotate keys if rate limits are hit.`}
                            </span>
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
