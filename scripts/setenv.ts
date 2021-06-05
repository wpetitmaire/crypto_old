const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
   
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   COINBASE_API_KEY: "${process.env.COINBASE_API_KEY}",
   COINBASE_SECRET_KEY: "${process.env.COINBASE_SECRET_KEY}",
   COINBASE_BASE_URL: "${process.env.COINBASE_BASE_URL}",
   COINBASE_API_VERSION: "${process.env.COINBASE_API_VERSION}",
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});

