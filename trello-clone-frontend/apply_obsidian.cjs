const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
const listComponentTxt = fs.readFileSync('listcomponent.txt', 'utf-8');

const startIndex = code.indexOf('const ListComponent = ({');
const endIndex = code.indexOf('function App() {');

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find start or end index!");
} else {
    let newCode = code.substring(0, startIndex) + listComponentTxt + "\n\n" + code.substring(endIndex);
    fs.writeFileSync('src/App.tsx', newCode);
    console.log("Obsidian Glass ListComponent Restored.");
}
