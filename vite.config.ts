import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function getRepoName() {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  return repo || "sxsw-2026";
}

export default defineConfig(({ mode }) => {
  const repoName = getRepoName();
  return {
    base: mode === "production" ? `/${repoName}/` : "/",
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});

