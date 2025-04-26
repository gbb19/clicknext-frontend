'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/lib/context/AuthContext';

export default function HomePage() {
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
        // Redirect ตามสถานะการล็อกอิน
        if (user) {
            router.push('/workspace'); // หรือหน้าแรกหลังจากล็อกอิน
        } else {
            router.push('/auth/login'); // หรือหน้า login
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-16 h-16"></div>
        </div>
    );
}
