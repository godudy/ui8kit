export default {
  plugins: {
    // Use fileURLToPath to get a correct Windows path (pathname can produce "/E:/..." which breaks Tailwind config loading).
    tailwindcss: {
      config: (await import('node:url')).fileURLToPath(
        new URL('./tailwind.config.tests.js', import.meta.url)
      ),
    },
    autoprefixer: {},
  },
};
