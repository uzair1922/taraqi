Download Node.js from https://nodejs.org/en/download
Export PATH=$PATH"/usr/local/bin
Download Visual coder studio editor from https://code.visualstudio.com/download
Create a new **Project** with **Package.Json** file. Package.Json is created within the project directory **npm -i init** 
Open the Project directory and verify Package.Json file in it.
**cd/your/project/path** and install cypress via **npm install cypress --save -dev** in the terminal of the project directory.
After installing cypress download the source code from this repo in the project directory locally to run the automations.
Make sure your test specs directory is specified as per your local directories in the cypress.config.js file. Please see the attached config for reference.

const { defineConfig } = require("cypress");
      module.exports = defineConfig({
        e2e: {
          setupNodeEvents(on, config) {
            // implement node event listeners here
          },
          specPattern:'cypress/e2e/taraqi/*.js'
        },
      });

Cypress test spec files should always be in the e2e directory to run via Test Runner.
Install npm i moment in cypress which is s JavaScript date library for parsing, validating, manipulating, and formatting dates.
After you have installed and made required configuration changes run **npx cypress open** in the terminal of the proejct directory.
Select the E2E testing from the Test Runner, configure it and click on the taraqi.js file.
Automations will start running.
