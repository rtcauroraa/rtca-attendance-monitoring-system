import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),

        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
<<<<<<< HEAD
    server: {
        host: '0.0.0.0',
        port: 5173,
       
    },
=======

    // server: {
    //     // Force Vite to listen on all local interfaces
    //     host: '0.0.0.0',
    //     hmr: {
    //         // Tell Vite to route its client requests through your tunnel
    //         host: 'fikli3tozn.sharedwithexpose.com',
    //         protocol: 'wss', // Use secure web sockets over HTTPS
    //     },
    // },
    //
>>>>>>> e1996f8e47627489a595d914fd97118e2ae933b6
    resolve: {
        alias: {
            react: path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        },
    },
});
