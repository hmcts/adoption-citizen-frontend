import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const root = path.resolve(__dirname, './../../');
const sass = path.resolve(root, './main/assets/scss');
const images = path.resolve(root, './main/assets/images');

const copyLookAndFeelAssets = new CopyWebpackPlugin(
  [{ from: images, to: 'images' }],
);

export default {
  paths: { root, sass },
  plugins: [ copyLookAndFeelAssets ],
};
