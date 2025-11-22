import { useState } from 'react';
import { useSettings } from '../../hooks/use-settings';
import { generateText } from '../../services/gemini';
import { Button } from '../ui/Button';
import { Copy, RefreshCw, Check, Sparkles, Globe, Linkedin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import { cn } from '../../lib/utils';

type Platform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'aisearch' | 'all';

const platforms: { id: Platform; label: string; icon: any }[] = [
    { id: 'all', label: 'Omni-Channel (All)', icon: Sparkles },
    { id: 'twitter', label: 'Twitter', icon: Twitter },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'aisearch', label: 'AI Search / GEO', icon: Globe },
];

interface GeneratedContent {
    title: string;
    description: string;
    hashtags: string;
    tags: string;
}

export default function ContentGenerator() {
    const { isInitialized } = useSettings();
    const [topic, setTopic] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('all');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<Record<string, GeneratedContent>>({});
    const [copiedState, setCopiedState] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setResults({});

        try {
            const platformsToGenerate = selectedPlatform === 'all'
                ? platforms.filter(p => p.id !== 'all')
                : [platforms.find(p => p.id === selectedPlatform)!];

            const promises = platformsToGenerate.map(async (platform) => {
                const prompt = `Generate highly optimized content for the topic: "${topic}" designed to rank in Search Engines and AI Overviews (GEO).
        Platform: ${platform.label}
        
        CRITICAL SEO/GEO INSTRUCTIONS:
        1. **Entity Density**: Include specific entities (names, places, concepts, data) to help AI models 'understand' the content.
        2. **Information Gain**: Provide unique value or a direct answer to the user's intent in the first sentence.
        3. **NLP-Friendly**: Use clear Subject-Verb-Object sentence structures.
        4. **Keywords**: Integrate high-volume and LSI (Latent Semantic Indexing) keywords naturally.
        
        Platform Rules:
        - **Twitter**: Max 280 chars. Focus on a "Hook" + "Value" + "Call to Action".
        - **LinkedIn**: Professional tone. Use bullet points for readability if fitting.
        - **YouTube**: Title must be click-worthy (high CTR). Tags should cover broad and specific niches.
        - **AI Search**: Maximize factual density. Structure the description as a direct answer to a "What is" or "How to" question.
        
        Output Rules:
        1. Output strictly valid JSON.
        2. NO detailed articles.
        3. Fields: "title", "description", "hashtags", "tags".
        
        Output format:
        {
            "title": "...",
            "description": "...",
            "hashtags": "#tag1 #tag2",
            "tags": "tag1, tag2, tag3"
        }`;

                const text = await generateText(prompt);
                // Try to parse JSON, fallback to raw text if fails
                try {
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return { id: platform.id, content: JSON.parse(jsonMatch[0]) as GeneratedContent };
                    }
                    throw new Error("No JSON found");
                } catch (e) {
                    return {
                        id: platform.id,
                        content: {
                            title: "Error parsing",
                            description: text,
                            hashtags: "",
                            tags: ""
                        }
                    };
                }
            });

            const generatedResults = await Promise.all(promises);
            const newResults: Record<string, GeneratedContent> = {};
            generatedResults.forEach(r => {
                newResults[r.id] = r.content;
            });

            setResults(newResults);

        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedState(id);
        setTimeout(() => setCopiedState(null), 2000);
    };

    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="bg-amber-500/10 p-6 rounded-full text-amber-500">
                    <Sparkles size={48} />
                </div>
                <h2 className="text-2xl font-bold">API Key Required</h2>
                <p className="text-muted-foreground max-w-md">
                    Please go to Settings and configure your Google Gemini API Key to unlock the 100X Content Generator.
                </p>
                <Button onClick={() => window.location.href = '/settings'}>
                    Go to Settings
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Left Panel: Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Content Generator</h2>
                    <p className="text-muted-foreground">
                        Create optimized content for any platform in seconds.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Topic or URL</label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Paste a URL or describe your topic..."
                            className="w-full h-32 bg-card border border-input rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target Platform</label>
                        <div className="grid grid-cols-2 gap-2">
                            {platforms.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPlatform(p.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border",
                                        selectedPlatform === p.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card hover:bg-accent border-border text-muted-foreground"
                                    )}
                                >
                                    <p.icon size={16} />
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!topic || isGenerating}
                        className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate Content
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Panel: Results */}
            <div className="lg:col-span-8 space-y-6">
                {Object.keys(results).length === 0 && !isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl p-12 bg-card/50">
                        <Sparkles size={48} className="mb-4 opacity-20" />
                        <p>Ready to generate. Enter a topic and hit the magic button.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {Object.entries(results).map(([platformId, content]) => {
                            const platform = platforms.find(p => p.id === platformId);
                            return (
                                <div key={platformId} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-medium">
                                            {platform?.icon && <platform.icon size={18} className="text-primary" />}
                                            {platform?.label}
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        {/* Title */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                <span>Title</span>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(content.title, `${platformId}-title`)}>
                                                    {copiedState === `${platformId}-title` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                </Button>
                                            </div>
                                            <div className="p-3 bg-muted/30 rounded-lg text-sm font-medium">
                                                {content.title}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                <span>Description</span>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(content.description, `${platformId}-desc`)}>
                                                    {copiedState === `${platformId}-desc` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                </Button>
                                            </div>
                                            <div className="p-3 bg-muted/30 rounded-lg text-sm whitespace-pre-wrap">
                                                {content.description}
                                            </div>
                                        </div>

                                        {/* Tags Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    <span>Hashtags</span>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(content.hashtags, `${platformId}-hash`)}>
                                                        {copiedState === `${platformId}-hash` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                    </Button>
                                                </div>
                                                <div className="p-3 bg-muted/30 rounded-lg text-xs text-primary">
                                                    {content.hashtags}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    <span>Tags</span>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(content.tags, `${platformId}-tags`)}>
                                                        {copiedState === `${platformId}-tags` ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                    </Button>
                                                </div>
                                                <div className="p-3 bg-muted/30 rounded-lg text-xs font-mono">
                                                    {content.tags}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {isGenerating && (
                            <div className="space-y-4 opacity-50 pointer-events-none">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-64 bg-card border border-border rounded-xl animate-pulse" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
