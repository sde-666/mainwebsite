import React from 'react';

export interface AdBannerProps {
  slotId?: string;
  adClient?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-feed' | 'in-article' | 'sticky-bottom';
  className?: string;
  showLabel?: boolean;
  fallbackType?: 'app' | 'youtube' | 'notes' | 'telegram' | 'mock-test' | 'calculator' | 'general';
}

/**
 * AdBanner - Completely cleaned of dummy ads, dummy placeholders, and AdSense tracking.
 * Returns null to maintain a clean, distraction-free educational experience.
 */
export function AdBanner(_props: AdBannerProps) {
  return null;
}
