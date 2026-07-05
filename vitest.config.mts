import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "coverage/**",
        "src/lib/supabase/**",
        "src/features/recall-logs/services/recall-log-service.ts",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
      ],
    },
  },
});
