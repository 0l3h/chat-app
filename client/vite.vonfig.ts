import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from 'tailwindcss';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5000
    },
    preview: {
        host: true,
        port: 5000
    },
    css: {
        postcss: {
          plugins: [tailwindcss()],
        },
    }
});