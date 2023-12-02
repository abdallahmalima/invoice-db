'use client';
import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { UserAuth } from '../../demo/components/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}



export default function AppLayout({ children }: AppLayoutProps) {
    const router=useRouter()
    const { user } = UserAuth();
    if (!user) {
        router.push('/auth/login');
      }

      
    return <Layout>{children}</Layout>;
}
