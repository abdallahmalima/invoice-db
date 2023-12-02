'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import AuthCheck from '../demo/components/AuthCheck';
import './global.css'
import { useEffect } from 'react';
import { FIREBASE_AUTH } from '../firebase.config';
import { useRouter } from 'next/navigation';
import { AuthContextProvider } from '../demo/components/context/AuthContext';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

  

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
              <  AuthContextProvider>
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
                </AuthContextProvider>
            </body>
        </html>
    );
}
