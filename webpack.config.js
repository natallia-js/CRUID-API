import path from 'path';

const config = {
    mode: 'production',
    target: 'node',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(import.meta.dirname, 'dist'),
        filename: 'bundle.cjs'
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            '@classes': path.resolve(import.meta.dirname, 'src/classes'),
            '@processes': path.resolve(import.meta.dirname, 'src/processes')
        },
    },     
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};

export default config;
