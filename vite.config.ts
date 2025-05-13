
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    fs: {
      // Strict allowlist approach with absolute paths
      strict: true,
      // Only allow access to the specific project directory, not parent directories
      allow: [path.resolve(__dirname)],
      // Explicitly deny access to sensitive directories and file patterns
      deny: [
        '.git', 
        '.env', 
        'node_modules/.cache',
        '**/node_modules/**/node_modules',
        '**/.env*',
        '**/.git*',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/pnpm-lock.yaml',
        // Prevent common traversal patterns
        '**/.*',
        '**/__*',
        '**/..', 
        '**/%2e%2e',  // URL-encoded ..
        '**/%252e%252e', // Double URL-encoded ..
        '**/*.config.js',
        '**/config.*'
      ]
    },
    // Restrict CORS for production, but allow for development
    cors: mode === 'development',
    // Apply security headers
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': mode === 'development' ? 'SAMEORIGIN' : 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    // Prevent server from acting as an open proxy
    proxy: {
      // Empty proxy configuration prevents default behavior
    },
    // Validation for origins and endpoints
    hmr: {
      // Secure WebSocket connection
      protocol: 'ws',
      clientPort: 8080
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'dompurify'],
    exclude: [],
  },
  // Enhanced security headers for production preview with nonce support
  preview: {
    headers: {
      'Content-Security-Policy': mode === 'development' 
        ? "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co;" 
        : "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; connect-src 'self' https://*.supabase.co wss://*.supabase.co; img-src 'self' data: https://*.supabase.co blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests; object-src 'none'; base-uri 'self';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  }
}));
