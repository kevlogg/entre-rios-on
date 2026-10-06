'use client';

import React, { Suspense } from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';

interface DynamicLayoutWrapperProps {
  children: React.ReactNode;
  selectedCityId?: string;
}

function DynamicLayoutContent({ children }: DynamicLayoutWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#e9ecef]">
      <div className="relative bg-gradient-on-mas">
        <ClientHeader />
      </div>
      <div className="flex-1 w-full bg-[#e9ecef] text-slate-900">
        {children}
      </div>
      <ClientFooter />
    </div>
  );
}

export function DynamicLayoutWrapper({ children, selectedCityId }: DynamicLayoutWrapperProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#e9ecef]">
        <div className="relative bg-gradient-on-mas">
          <ClientHeader />
        </div>
        <div className="flex-1 w-full bg-[#e9ecef] text-slate-900">{children}</div>
        <ClientFooter />
      </div>
    }>
      <DynamicLayoutContent selectedCityId={selectedCityId}>
        {children}
      </DynamicLayoutContent>
    </Suspense>
  );
}
