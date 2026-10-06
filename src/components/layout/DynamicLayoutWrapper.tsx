'use client';

import React, { Suspense } from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { PageBackground } from '@/components/common/PageBackground';

interface DynamicLayoutWrapperProps {
  children: React.ReactNode;
  heroContent?: React.ReactNode;
  selectedCityId?: string;
}

function DynamicLayoutContent({ children, heroContent }: DynamicLayoutWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#e9ecef] w-full max-w-full overflow-x-hidden">
      {/* Top Header & Hero Area with ON MÁS Gradient Background */}
      <div className="relative bg-gradient-on-mas pb-6 sm:pb-8 shadow-md w-full overflow-hidden">
        <PageBackground />
        <ClientHeader />
        {heroContent && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 relative z-10">
            {heroContent}
          </div>
        )}
      </div>

      {/* Main Content Area in Gray #e9ecef */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900 overflow-x-hidden">
        {children}
      </main>

      <ClientFooter />
    </div>
  );
}

export function DynamicLayoutWrapper({ children, heroContent, selectedCityId }: DynamicLayoutWrapperProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#e9ecef] w-full max-w-full overflow-x-hidden">
        <div className="relative bg-gradient-on-mas pb-6 sm:pb-8 shadow-md w-full overflow-hidden">
          <PageBackground />
          <ClientHeader />
        </div>
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900 overflow-x-hidden">{children}</main>
        <ClientFooter />
      </div>
    }>
      <DynamicLayoutContent heroContent={heroContent} selectedCityId={selectedCityId}>
        {children}
      </DynamicLayoutContent>
    </Suspense>
  );
}
