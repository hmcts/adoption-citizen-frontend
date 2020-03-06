import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const packageJson = require.resolve('govuk-frontend/package.json');
const root = path.resolve(packageJson, '..', 'govuk');
const sass = path.resolve(root, 'all.scss');
const javascript = path.resolve(root, 'all.js');
const components = path.resolve(root, 'components');
const assets = path.resolve(root, 'assets');
const images = path.resolve(assets, 'images');
const fonts = path.resolve(assets, 'fonts');

const copyGovukTemplateAssets = new CopyWebpackPlugin([
  { from: images, to: 'assets/images' },
  { from: fonts, to: 'assets/fonts' },
]);

export default {
  paths: { template: root, components, sass, javascript, assets },
  plugins: [copyGovukTemplateAssets],
};