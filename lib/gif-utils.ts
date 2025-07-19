// lib/gif-utils.ts
// Utility to extract frames from a GIF file in the browser using gifuct-js

import { decompressFrames, parseGIF } from 'gifuct-js';

export async function extractFramesFromGIF(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer || typeof buffer === 'string') {
          reject('Invalid GIF buffer');
          return;
        }
        const gif = parseGIF(buffer as ArrayBuffer);
        const frames = decompressFrames(gif, true);
        // Convert each frame to a data URL
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Could not get canvas context');
          return;
        }
        canvas.width = gif.lsd.width;
        canvas.height = gif.lsd.height;
        const frameDataUrls: string[] = [];
        for (const frame of frames) {
          const imageData = ctx.createImageData(gif.lsd.width, gif.lsd.height);
          imageData.data.set(frame.patch);
          ctx.putImageData(imageData, 0, 0);
          frameDataUrls.push(canvas.toDataURL('image/png'));
        }
        resolve(frameDataUrls);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
