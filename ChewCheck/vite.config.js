import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDirL: 'dist',
        rollupOptions: {
            input: {
                main: './index.html',
                add: './add.html',
                // calendar: './calendar.html'
            }
        }
    }
})