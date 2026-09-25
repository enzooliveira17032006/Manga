const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  "dev:backend": "ts-node src/api/server.ts",
  "dev:frontend": "next dev -p 3000",
  "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
  "build": "next build"
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
