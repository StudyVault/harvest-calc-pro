import { defineConfig } from '@vite-pwa/assets-generator'

export default defineConfig({
  preset: {
    name: 'minimal-2023',
    transparent: {
      sizes: [64, 192, 512]
    },
    maskable: {
      sizes: [512]
    },
    apple: {
      sizes: [180],
      transparent: true
    }
  },
  images: ['public/logo.svg']
}) 