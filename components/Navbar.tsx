'use client';

import Link from 'next/link';
import { Terminal, User, LogOut, History } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Fetch user session/profile to check auth state
    // Since we are using httpOnly cookies for auth, we can try to fetch the user profile
    // If it fails (401), we are not logged in.
    fetch('/api/user')
        .then(res => {
            if (res.ok) return res.json();
            return null;
        })
        .then(data => setUser(data))
        .catch(() => setUser(null));
  }, [pathname]); // Re-check on navigation

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Terminal className="w-6 h-6" />
          <h1 className="font-bold text-xl tracking-tight">CodeGen Copilot</h1>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
                <Link 
                    href="/history" 
                    className={`flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ${pathname === '/history' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                </Link>
                <Link 
                    href="/profile" 
                    className={`flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ${pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name || 'Profile'}</span>
                </Link>
                <a href="/api/auth/signout" className="text-muted-foreground hover:text-destructive transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                </a>
            </div>
          ) : (
            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Login
                </Link>
                <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                    Register
                </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
