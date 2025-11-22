
import { NavLink } from 'react-router-dom';
import { PenTool, Image, Search, Settings, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { icon: PenTool, label: 'Content Gen', path: '/' },
    { icon: Image, label: 'Brand Kit', path: '/brand-kit' },
    { icon: Search, label: 'AI Search / GEO', path: '/geo' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-border h-screen sticky top-0 flex flex-col">
            <div className="p-6 flex items-center gap-2 border-b border-border/50">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    <Sparkles size={18} />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    SocialSEO
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    size={20}
                                    className={cn(
                                        "transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border/50">
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Pro Plan</h3>
                    <p className="text-xs text-muted-foreground mb-3">100X Efficiency Unlocked</p>
                    <button className="w-full py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
}
