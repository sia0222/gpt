import path from "node:path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

/** 개발 서버는 항상 http://localhost:5181 — 다른 프로세스가 5181을 쓰면 종료 후 실행하세요. */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    open: true,
    port: 5181,
    strictPort: true,
  },
});
