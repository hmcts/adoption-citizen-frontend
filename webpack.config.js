import * as path from 'path';
import govukFrontend from './src/main/modules/webpack/govukFrontend';
import scss from './src/main/modules/webpack/scss';

const sourcePath = path.resolve(__dirname, 'src/main/');

export default {
  plugins: [...govukFrontend.plugins, ...scss.plugins],
  entry: path.resolve(sourcePath, 'index.ts'),
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      ...scss.rules,
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'src/main/public/'),
    filename: 'main.js',
  },
};
