'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface DynamicLayoutWrapperProps {
  children: React.ReactNode;
  selectedCityId?: string;
}

function DynamicLayoutContent({ children, selectedCityId }: DynamicLayoutWrapperProps) {
  const searchParams = useSearchParams();
  const [theme, setTheme] = useState<'a' | 'b'>('a');

  useEffect(() => {
    const themeParam = searchParams.get('theme') || searchParams.get('version');
    if (themeParam === 'b' || themeParam === 'editorial') {
      setTheme('b');
      localStorage.setItem('entre_rios_on_theme', 'b');
    } else if (themeParam === 'a' || themeParam === 'client') {
      setTheme('a');
      localStorage.setItem('entre_rios_on_theme', 'a');
    } else {
      const savedTheme = localStorage.getItem('entre_rios_on_theme');
      if (savedTheme === 'b') {
        setTheme('b');
      } else {
        setTheme('a');
      }
    }
  }, [searchParams]);

  const isEditorial = theme === 'b';

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isEditorial ? 'bg-[#fbf9f5]' : 'bg-[#f8fafc]'}`}>
      {isEditorial ? (
        <Header selectedCityId={selectedCityId} />
      ) : (
        <ClientHeader />
      )}

      <div className="flex-1 w-full">
        {children}
      </div>

      {isEditorial ? (
        <Footer />
      ) : (
        <ClientFooter />
      )}
    </div>
  );
}

export function DynamicLayoutWrapper({ children, selectedCityId }: DynamicLayoutWrapperProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <ClientHeader />
        <div className="flex-1">{children}</div>
        <ClientFooter />
      </div>
    }>
      <DynamicLayoutContent selectedCityId={selectedCityId}>
        {children}
      </DynamicLayoutContent>
    </Suspense>
  );
}
