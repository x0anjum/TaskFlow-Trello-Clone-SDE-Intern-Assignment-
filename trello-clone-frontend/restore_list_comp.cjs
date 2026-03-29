const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
const listComponentTxt = fs.readFileSync('listcomponent.txt', 'utf-8');

// Find where ListComponent starts in App.tsx
const startIndex = code.indexOf('const ListComponent = ({');
// Find where it ends. It's used right before const App = () => {
const endIndex = code.indexOf('const App = () => {');

console.log("Found ListComponent at index", startIndex, "to", endIndex);

// Replace the segment
let newCode = code.substring(0, startIndex) + listComponentTxt + "\n\n" + code.substring(endIndex);

fs.writeFileSync('src/App.tsx', newCode);
console.log('Restored ListComponent from listcomponent.txt');
