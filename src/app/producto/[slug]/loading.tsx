import React from 'react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';

export default function ProductDetailLoading() {
  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full animate-pulse">
        <div className="max-w-[1400px] mx-auto space-y-6 pb-16 px-0">
          {/* Main Card Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row lg:divide-x divide-slate-100">
            {/* Left Column: Image Skeleton */}
            <div className="lg:w-[48%] flex flex-col md:flex-row p-4 sm:p-6 gap-3 sm:gap-5">
              {/* Thumbnail skeletons */}
              <div className="hidden md:flex flex-col gap-2.5 shrink-0">
                <div className="w-16 h-16 rounded-xl bg-slate-200" />
                <div className="w-16 h-16 rounded-xl bg-slate-200" />
                <div className="w-16 h-16 rounded-xl bg-slate-200" />
              </div>

              {/* Main photo placeholder */}
              <div className="relative flex-1 aspect-square sm:aspect-[4/3] md:min-h-[440px] md:max-h-[540px] bg-slate-200 rounded-2xl flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-300/60" />
              </div>
            </div>

            {/* Right Column: Information Skeleton */}
            <div className="lg:w-[52%] p-5 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Verified Badge Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-6 w-24 bg-slate-200 rounded-lg" />
                  <div className="h-6 w-32 bg-slate-200 rounded-lg" />
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2">
                  <div className="h-7 sm:h-8 w-11/12 bg-slate-200 rounded-xl" />
                  <div className="h-7 sm:h-8 w-3/4 bg-slate-200 rounded-xl" />
                </div>

                {/* Commerce Banner Skeleton */}
                <div className="h-14 w-full bg-slate-100 rounded-xl border border-slate-200/80" />

                {/* Price Skeleton */}
                <div className="space-y-1.5 pt-2">
                  <div className="h-4 w-16 bg-slate-200 rounded-sm" />
                  <div className="h-10 w-44 bg-slate-200 rounded-xl" />
                </div>

                {/* Action CTA Button Skeleton */}
                <div className="h-14 w-full bg-emerald-600/30 rounded-2xl" />

                {/* Description Skeleton */}
                <div className="space-y-2 pt-4">
                  <div className="h-4 w-full bg-slate-200 rounded-md" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded-md" />
                  <div className="h-4 w-4/6 bg-slate-200 rounded-md" />
                </div>
              </div>

              {/* Location footer Skeleton */}
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </DynamicLayoutWrapper>
  );
}
