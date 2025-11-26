import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Use the provided key directly to fix the connection error
  const apiKey = process.env.API_KEY || env.API_KEY || env.VITE_API_KEY || 'AIzaSyDvSXvrQyJLsXl9243ybiqd2l9xQk5Xoxk';

  return {
    plugins: [react()],
    define: {
      // Inject the API Key securely
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Prevent "process is not defined" crash in browser
      'process.env': {} 
    }
  };
});