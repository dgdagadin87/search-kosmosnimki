import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import cpy from 'rollup-plugin-cpy';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';
import { uglify } from "rollup-plugin-uglify";
import livereload from 'rollup-plugin-livereload';

export default [
    {
        input: 'src/js/main.js',
        output: { 
            file: pkg.main,            
            format: 'iife',
            sourcemap: true,
            globals: {
                leaflet: 'L',
                moment: 'moment'
            },            
        },   
        external: ['leaflet', 'leaflet-geomixer', 'moment'], 
        plugins: [
            resolve({jsnext: true, main: true, module: false, browser: false}),
            commonjs(),
            css({dest: 'dist/bundle.css', minified: true}),
            cpy([
                { files: 'src/version/*', dest: 'dist' },
                { files: 'node_modules/scanex-auth/dist/*.png', dest: 'dist' },
                { files: 'node_modules/scanex-color-picker/dist/*.png', dest: 'dist' },
                { files: 'node_modules/scanex-datagrid/dist/*.png', dest: 'dist' },
                { files: 'node_modules/scanex-float-panel/dist/*.png', dest: 'dist' },
                { files: 'node_modules/scanex-search-input/dist/*.png', dest: 'dist' },
                { files: 'node_modules/leaflet-iconlayers/dist/*.png', dest: 'dist' },
                { files: 'src/fonts/*.woff', dest: 'dist/fonts' },
                { files: 'src/img/*.*', dest: 'dist/img' },
            ]),
            babel(),
            //uglify(),
            serve({
                contentBase:['', 'dist'],
                host: 'localhost',
                port: 8080,
            }),
            livereload('dist')
        ]
    }
]; 