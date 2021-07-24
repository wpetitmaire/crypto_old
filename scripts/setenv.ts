// let setenv = () => {
//    var { writeFile } = require('fs');
// var { argv } = require('yargs');

// // Récupération de la configuration dans le .env
// const objetDeConfiguration = require('dotenv').config();

// // Récupération du fichier de configuration 
// const environnement = argv.environment;
// const environnementDeProduction = environnement === 'prod';
// const cheminVersLeFichier = environnementDeProduction
//    ? `./src/environments/environment.prod.ts`
//    : `./src/environments/environment.ts`;
   
// // Construction du nouveau contenu
// // const environmentFileContent = `
// // export const environment = {
// //    production: ${isProduction},
// //    COINBASE_API_KEY: "${process.env.COINBASE_API_KEY}",
// //    COINBASE_SECRET_KEY: "${process.env.COINBASE_SECRET_KEY}",
// //    COINBASE_BASE_URL: "${process.env.COINBASE_BASE_URL}",
// //    COINBASE_API_VERSION: "${process.env.COINBASE_API_VERSION}",
// // };
// // `;

// let message = "";
// const contenuDuNouveauFichierDeConfiguration = () => {

//    const dernierParametre = Object.keys(objetDeConfiguration)[Object.keys(objetDeConfiguration).length - 1];
//    let sortie = `
// export const environment = {
//    production: ${environnementDeProduction},\n
// `;

//    for (const [parametre, valeur] of Object.entries(objetDeConfiguration.parsed)) {

//       message += `${parametre} --> ${valeur}\n`;

//       parametre !== dernierParametre 
//          ? sortie += `  ${parametre}: "${valeur}",\n`
//          : sortie += `  ${parametre}: "${valeur}"\n`;
//    };

//    sortie += `};`;

//    console.log(sortie);
//    console.log(message);

//    return sortie;

//    return `
//    export const environment = {
//       production: ${environnementDeProduction},
//       COINBASE_API_KEY: "${process.env.COINBASE_API_KEY}",
//       COINBASE_SECRET_KEY: "${process.env.COINBASE_SECRET_KEY}",
//       COINBASE_BASE_URL: "${process.env.COINBASE_BASE_URL}",
//       COINBASE_API_VERSION: "${process.env.COINBASE_API_VERSION}",
//    };
//    `
// }

// // Écriture dans le fichier
// writeFile(cheminVersLeFichier, contenuDuNouveauFichierDeConfiguration(), function (err) {
//    if (err) {
//       console.error(err);
//    }
//    console.info(message);
// });


// }

// setenv();