module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        shippedProposals: true,
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-export-default-from'],
}
