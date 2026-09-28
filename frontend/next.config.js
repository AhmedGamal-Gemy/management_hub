/** @type {import('next').NextConfig} */
const nextConfig = {
  // Single-port contract: the browser only ever talks to Next.js.
  // Same-origin /backend/* requests are forwarded server-side to FastAPI,
  // so only port 3000 needs an external mapping (Replit allows exactly one).
  // BACKEND_INTERNAL_URL differs per environment:
  //   - docker-compose: http://backend:8000 (container DNS)
  //   - Replit:         http://localhost:8000 (same machine, internal port)
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.BACKEND_INTERNAL_URL || "http://localhost:8000"}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
