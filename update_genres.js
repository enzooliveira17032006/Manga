const fs = require('fs');

// Add more genres to CatalogView
let view = fs.readFileSync('components/CatalogView.tsx', 'utf8');
view = view.replace(
  /const AVAILABLE_GENRES = \[[^\]]+\];/,
  "const AVAILABLE_GENRES = ['Action', 'Romance', 'Comedy', 'Fantasy', 'Horror', 'Slice of Life', 'Succubus', 'Isekai', 'Harem', 'School Life'];"
);
fs.writeFileSync('components/CatalogView.tsx', view);

// Add mapping to MangaDexProvider
let md = fs.readFileSync('src/providers/MangaDexProvider.ts', 'utf8');
const newMapping = `
        const genresMap: Record<string, string> = {
          'action': '391b0423-d847-456f-aff0-8b0cfc03066b',
          'romance': '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
          'comedy': '4d32cc48-9f00-4cca-9b5a-a839f0764984',
          'fantasy': 'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
          'horror': 'cdad7e68-1419-41dd-bdce-27753074a640',
          'slice of life': 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9',
          'succubus': '5bd0e105-4481-44ca-b6e7-7544da56b1a3', // Monster Girls / Succubus equivalent
          'isekai': 'ace04997-f6bd-436e-b261-779182147d35', // Isekai
          'harem': 'aafb99c1-7f60-43fa-bfce-801791b54c76', // Harem
          'school life': 'caaa44eb-cd40-4177-b930-79d3ef2afe87' // School Life
        };
`;
md = md.replace(/const genresMap: Record<string, string> = \{[\s\S]*?\};/, newMapping.trim());
fs.writeFileSync('src/providers/MangaDexProvider.ts', md);
console.log('Added more genres');
