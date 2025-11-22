import { useState } from 'react';
import { useSettings } from '../../hooks/use-settings';
import { generateImage } from '../../services/gemini';
import { Button } from '../ui/Button';
import { Download, Sparkles, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { cn } from '../../lib/utils';

const assetTypes = [
    { id: 'logo', label: 'Logo', ratio: '1:1', width: 1024, height: 1024 },
    { id: 'banner', label: 'Banner / Header', ratio: '16:9', width: 1920, height: 1080 },
    { id: 'post', label: 'Social Post', ratio: '4:5', width: 1080, height: 1350 },
    { id: 'story', label: 'Story', ratio: '9:16', width: 1080, height: 1920 },
    { id: 'thumbnail', label: 'Thumbnail', ratio: '16:9', width: 1280, height: 720 },
];

export default function BrandKit() {
    const { isInitialized } = useSettings();
    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState(assetTypes[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!description) return;
        setIsGenerating(true);
        setGeneratedImages([]);

        try {
            const prompt = `Create a professional ${selectedType.label} for a brand described as: "${description}". 
      Style: High quality, professional, modern. 
      Aspect Ratio: ${selectedType.ratio}`;

            // Call the service (currently a placeholder)
            const images = await generateImage(prompt);
            setGeneratedImages(images);
        } catch (error) {
            console.error("Image generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = (url: string, index: number) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `brand-asset-${selectedType.id}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="bg-amber-500/10 p-6 rounded-full text-amber-500">
                    <ImageIcon size={48} />
                </div>
                <h2 className="text-2xl font-bold">API Key Required</h2>
                <p className="text-muted-foreground max-w-md">
                    Please go to Settings and configure your Google Gemini API Key to use the Brand Kit.
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
                    <h2 className="text-3xl font-bold tracking-tight">Brand Kit</h2>
                    <p className="text-muted-foreground">
                        Generate professional visual assets for your brand identity.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Brand Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your brand, colors, and visual style..."
                            className="w-full h-32 bg-card border border-input rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Asset Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {assetTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type)}
                                    className={cn(
                                        "flex flex-col items-start gap-1 px-3 py-3 rounded-lg text-sm transition-all border text-left",
                                        selectedType.id === type.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card hover:bg-accent border-border text-muted-foreground"
                                    )}
                                >
                                    <span className="font-medium">{type.label}</span>
                                    <span className="text-xs opacity-70">{type.ratio} • {type.width}x{type.height}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!description || isGenerating}
                        className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/20"
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                                Designing...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="mr-2 h-5 w-5" />
                                Generate Assets
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Panel: Results */}
            <div className="lg:col-span-8 space-y-6">
                {generatedImages.length === 0 && !isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl p-12 bg-card/50">
                        <LayoutTemplate size={48} className="mb-4 opacity-20" />
                        <p>Describe your brand and select an asset type to start designing.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isGenerating ? (
                            // Loading Skeletons
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-card border border-border rounded-xl animate-pulse flex items-center justify-center">
                                    <Sparkles className="text-muted-foreground/20 animate-bounce" size={32} />
                                </div>
                            ))
                        ) : (
                            generatedImages.map((url, index) => (
                                <div key={index} className="group relative aspect-square bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-in fade-in zoom-in duration-500">
                                    <img
                                        src={url}
                                        alt={`Generated asset ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => handleDownload(url, index)}
                                            className="rounded-full"
                                        >
                                            <Download size={20} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
