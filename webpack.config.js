const path = require('path');
const fs = require('fs');

// Get all JavaScript files in the 'out' directory
const files = fs.readdirSync(path.resolve(__dirname, 'out')).filter(file => file.endsWith('.js'));

module.exports = {
  entry: files.map(file => `./out/${file}`), // Entry points from the 'out' directory
  output: {
    filename: 'output.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'production', // Use 'development' for unminified output
};
