let razenv = () => {
   var { writeFile } = require('fs');
var { argv } = require('yargs');

// Récupération de la configuration dans le .env
const objetDeConfiguration = require('dotenv').config();

// Récupération du fichier de configuration 
const environnement = argv.environment;
const environnementDeProduction = environnement === 'prod';
const cheminVersLeFichier = environnementDeProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
   
// Construction du nouveau contenu
const environmentFileContent = `
export const environment = {
   production: ${environnementDeProduction},
   COINBASE_API_KEY: "",
   COINBASE_SECRET_KEY: "",
   COINBASE_BASE_URL: "",
   COINBASE_API_VERSION: "",
};
`;

// Écriture dans le fichier
writeFile(cheminVersLeFichier, environmentFileContent, function (err) {
   if (err) {
      console.error(err);
   }
   console.info(`Environnement ${cheminVersLeFichier} réinitialisé.`);
});


}

razenv();