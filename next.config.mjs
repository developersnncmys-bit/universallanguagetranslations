/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first (best compression ~30-50% smaller than WebP), WebP as
    // fallback. The service PNGs ship at ~2.5MB each; AVIF/WebP cuts
    // them to a few hundred KB without visible quality loss.
    formats: ["image/avif", "image/webp"],
    // Only generate the sizes the layout actually requests. The
    // `sizes` prop on <Image> picks from this list.
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 160, 256, 384],
    // Cache optimized images for 7 days before Next's optimizer
    // regenerates them — the service imagery is static, no need to
    // re-encode on every request.
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Next 15 requires every `quality=` value used in <Image> to be
    // allowlisted here. The service PNGs render at `quality={78}` to
    // keep edge detail in the photographic imagery; 75 stays as the
    // default fallback for everything else.
    qualities: [75, 78],
  },
};

export default nextConfig;
