const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');
const seedPath = path.join(__dirname, '../src/seedData.ts');

const dbContent = fs.readFileSync(dbPath, 'utf-8');
const seedContent = `import { DBState } from "./types";\n\nexport const INITIAL_SEED_DATA: DBState = ${dbContent};\n`;

fs.writeFileSync(seedPath, seedContent, 'utf-8');
console.log('Successfully updated src/seedData.ts from cleaned db.json!');
