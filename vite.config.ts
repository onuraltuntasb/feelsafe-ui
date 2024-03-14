import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

const env = loadEnv("all", process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target:
          env.MODE === "development"
            ? env.VITE_REACT_APP_BACKEND_HOST_PORT_DEV
            : env.VITE_REACT_APP_BACKEND_HOST_PORT_PROD,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString()
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
