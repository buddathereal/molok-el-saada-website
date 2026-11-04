import type React from 'react';

export const LOCAL_IMAGE_FALLBACK = '/image-placeholder.svg';
export const LOCAL_LAMP_ASSET = '/royal-lamp.svg';

export const optimizeCloudinaryImage = (url: string, width: number) => {
  if (!url || !url.includes('/image/upload/')) return url;
  const normalized = url.replace('/image/upload/f_auto,q_auto/', '/image/upload/');
  return normalized.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
};

export const cloudinarySrcSet = (url: string) =>
  url && url.includes('/image/upload/')
    ? [480, 960, 1440].map((width) => `${optimizeCloudinaryImage(url, width)} ${width}w`).join(', ')
    : undefined;

export const handleSafeImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.srcset = '';
  img.src = LOCAL_IMAGE_FALLBACK;
};

