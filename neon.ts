import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    buckets: {
      images: {
        access: "public_read", // or "public_read", assuming images are public based on design.md or keep it simple. Let's make it public.
      },
    },
  },
});
