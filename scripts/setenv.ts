const { writeFile } = require('fs');
const { argv } = require('yargs');

// Récupération de la configuration dans le .env
require('dotenv').config();

// Récupération du fichier de configuration 
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
   
// Construction du nouveau contenu
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   COINBASE_API_KEY: "${process.env.COINBASE_API_KEY}",
   COINBASE_SECRET_KEY: "${process.env.COINBASE_SECRET_KEY}",
   COINBASE_BASE_URL: "${process.env.COINBASE_BASE_URL}",
   COINBASE_API_VERSION: "${process.env.COINBASE_API_VERSION}",
};
`;

// Écriture dans le fichier
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }
   console.log(`Mise en place des paramètres dans le fichier : ${targetPath}`);
});

