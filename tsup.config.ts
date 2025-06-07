import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  splitting: true,
  dts: true,
  sourcemap: true,
  clean: true,
});
