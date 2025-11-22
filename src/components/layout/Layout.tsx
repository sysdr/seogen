
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div className="flex min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Gradients */}
                <div className="fixed inset-0 z-[-1] pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto p-8 max-w-7xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
