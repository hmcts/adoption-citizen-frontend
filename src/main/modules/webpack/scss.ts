import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const miniCss = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].css',
  chunkFilename: '[id].css',
});

export default {
  rules: [{
    test: /\.scss$/,
    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
  }],
  plugins: [miniCss],
};
