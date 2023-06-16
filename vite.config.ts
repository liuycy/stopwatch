import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: 'es6',
        sourcemap: true,
    },

    plugins: [uni()],
});
