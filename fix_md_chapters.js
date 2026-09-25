const fs = require('fs');
let md = fs.readFileSync('src/providers/MangaDexProvider.ts', 'utf8');

md = md.replace(
  "order: { chapter: 'asc' },\n            limit: 500\n          }",
  "order: { chapter: 'asc' },\n            limit: 500,\n            'contentRating[]': ['safe', 'suggestive', 'erotica', 'pornographic']\n          }"
);

fs.writeFileSync('src/providers/MangaDexProvider.ts', md);
console.log('Fixed feed API');
