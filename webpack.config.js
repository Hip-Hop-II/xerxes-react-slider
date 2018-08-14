const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const __DEV__ = process.env.NODE_ENV === 'development'

module.exports = {
  mode: 'development',
  entry: {
    ReactSlider: './src/index.tsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json']
  },
  devServer: {
    open: true,
    overlay: true,
    progress: true,
    compress: true,
    inline: true
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'example')],
            loader: 'babel-loader'
          },
          {
            test: /\.(ts|tsx)$/,
            include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'example')],
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'example/index.html')
    })
  ]
}
