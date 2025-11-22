import { useState } from 'react';
import { useSettings } from '../../hooks/use-settings';
import { generateText } from '../../services/gemini';
import { Button } from '../ui/Button';
import { Search, Code, BarChart3, CheckCircle, AlertTriangle, Copy, Check } from 'lucide-react';


export default function GeoOptimizer() {
    const { isInitialized } = useSettings();
    const [content, setContent] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [schema, setSchema] = useState('');
    const [copiedSchema, setCopiedSchema] = useState(false);

    const handleAnalyze = async () => {
        if (!content) return;
        setIsAnalyzing(true);
        setAnalysis(null);
        setSchema('');

        try {
            // Parallel requests for Analysis and Schema
            const analysisPrompt = `Analyze the following content for "Generative Engine Optimization" (GEO).
      Identify:
      1. Key Entities (People, Places, Concepts).
      2. Sentiment.
      3. Factuality Score (0-100).
      4. Missing Topics (what should be added for completeness).
      
      Content: "${content.substring(0, 5000)}"
      
      Output JSON format: { "entities": [], "sentiment": "", "score": 0, "missing": [] }`;

            const schemaPrompt = `Generate valid JSON-LD Schema.org markup for the following content. 
      Assume it is an Article or BlogPosting.
      
      Content: "${content.substring(0, 5000)}"
      
      Output ONLY the JSON code block.`;

            const [analysisRes, schemaRes] = await Promise.all([
                generateText(analysisPrompt),
                generateText(schemaPrompt)
            ]);

            // Parse Analysis (safely)
            try {
                const jsonMatch = analysisRes.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    setAnalysis(JSON.parse(jsonMatch[0]));
                } else {
                    // Fallback if JSON parsing fails
                    setAnalysis({ entities: ["Error parsing AI response"], score: 0, missing: [] });
                }
            } catch (e) {
                console.error("JSON Parse Error", e);
                setAnalysis({ entities: [], score: 0, missing: ["Could not parse analysis"] });
            }

            // Clean Schema
            const cleanSchema = schemaRes.replace(/```json|```/g, '').trim();
            setSchema(cleanSchema);

        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copySchema = () => {
        navigator.clipboard.writeText(schema);
        setCopiedSchema(true);
        setTimeout(() => setCopiedSchema(false), 2000);
    };

    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="bg-amber-500/10 p-6 rounded-full text-amber-500">
                    <Search size={48} />
                </div>
                <h2 className="text-2xl font-bold">API Key Required</h2>
                <p className="text-muted-foreground max-w-md">
                    Please go to Settings and configure your Google Gemini API Key to use the GEO Optimizer.
                </p>
                <Button onClick={() => window.location.href = '/settings'}>
                    Go to Settings
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Left Panel: Input */}
            <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">AI Search Optimizer</h2>
                    <p className="text-muted-foreground">
                        Optimize your content for AI Overviews and Search Generative Experience.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Content to Analyze</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your article, blog post, or product description here..."
                            className="w-full h-[400px] bg-card border border-input rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all font-mono"
                        />
                    </div>

                    <Button
                        onClick={handleAnalyze}
                        disabled={!content || isAnalyzing}
                        className="w-full h-12 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                    >
                        {isAnalyzing ? (
                            <>
                                <BarChart3 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-5 w-5" />
                                Analyze & Optimize
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Panel: Analysis */}
            <div className="lg:col-span-7 space-y-6">
                {!analysis && !isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl p-12 bg-card/50">
                        <BarChart3 size={48} className="mb-4 opacity-20" />
                        <p>Paste content to see how AI views your text.</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Score Card */}
                        {analysis && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-primary mb-2">{analysis.score}/100</span>
                                    <span className="text-sm text-muted-foreground">GEO Score</span>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
                                    <span className="text-xl font-bold text-foreground mb-2 capitalize">{analysis.sentiment || 'Neutral'}</span>
                                    <span className="text-sm text-muted-foreground">Sentiment</span>
                                </div>
                            </div>
                        )}

                        {/* Entities */}
                        {analysis && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-500" />
                                    Detected Entities
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.entities?.map((entity: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                            {entity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Missing Topics */}
                        {analysis && analysis.missing?.length > 0 && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-amber-500" />
                                    Missing Topics (Gap Analysis)
                                </h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {analysis.missing.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Schema Markup */}
                        {schema && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Code size={18} className="text-primary" />
                                        JSON-LD Schema
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={copySchema}>
                                        {copiedSchema ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </Button>
                                </div>
                                <pre className="p-4 text-xs font-mono overflow-x-auto bg-black/20 text-green-400">
                                    {schema}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
