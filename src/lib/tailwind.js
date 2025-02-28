"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssConfig = exports.viteConfig = void 0;
exports.viteConfig = "import { defineConfig } from \"vite\";\nimport tailwindcss from \"@tailwindcss/vite\";\nimport react from \"@vitejs/plugin-react-swc\";\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n});";
exports.cssConfig = "@import \"tailwindcss\";";
