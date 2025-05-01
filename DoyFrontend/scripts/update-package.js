const fs = require('fs');
const path = require('path');

// Read the existing package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Update package name and description
packageJson.name = "doy-food-delivery";
packageJson.description = "A comprehensive food delivery web application that provides personalized dining experiences";

// Update the scripts section
packageJson.scripts = {
  ...packageJson.scripts,
  "start": "vite --config vite.config.js",
  "build": "vite build",
  "serve": "vite preview",
  "server": "node server/index.js",
  "lint": "echo 'No linting configured'",
  "test": "echo 'No tests configured'",
  "dev": "vite" // Change to use Vite for development like CRA
};

// Update browser list for better compatibility
packageJson.browserslist = {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
};

// Add engine restrictions (optional but good practice)
packageJson.engines = {
  "node": ">=18.0.0",
  "npm": ">=8.0.0"
};

// Add repository information (if applicable)
packageJson.repository = {
  "type": "git",
  "url": "https://replit.com/@<your-username>/doy-food-delivery"
};

// React app common fields
packageJson.keywords = ["react", "food-delivery", "web-application"];
packageJson.author = "DOY Food Delivery";

// Remove TypeScript related dependencies
const removeTypeScriptDeps = (dependencies) => {
  if (!dependencies) return dependencies;
  
  const result = { ...dependencies };
  
  // Remove any TypeScript related packages
  Object.keys(result).forEach(pkg => {
    if (
      pkg.includes('@types/') || 
      pkg === 'typescript' || 
      pkg.startsWith('ts-') ||
      pkg.includes('typescript') ||
      pkg.includes('eslint-plugin-react-typescript')
    ) {
      delete result[pkg];
      console.log(`Removed TypeScript dependency: ${pkg}`);
    }
  });
  
  return result;
};

packageJson.dependencies = removeTypeScriptDeps(packageJson.dependencies);
packageJson.devDependencies = removeTypeScriptDeps(packageJson.devDependencies);
packageJson.peerDependencies = removeTypeScriptDeps(packageJson.peerDependencies);

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Package.json updated successfully!');