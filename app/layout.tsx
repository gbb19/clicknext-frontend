'use client';

import {ReactNode} from 'react';
import {AuthProvider} from '@/lib/context/AuthContext';
import './globals.css';
import {Geist, Geist_Mono} from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
            <AuthProvider>
                <main className="flex-1">{children}</main>
            </AuthProvider>
        </div>
        </body>
        </html>
    );
}
