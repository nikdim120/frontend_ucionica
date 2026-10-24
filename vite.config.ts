import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],build:{chunkSizeWarningLimit:1800},server:{allowedHosts:['terminal.local'],hmr:false}});
