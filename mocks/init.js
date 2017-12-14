/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const pug = require('pug');
global.fetch = require('jest-fetch-mock');

const pathToIndexPug = '../public/templates/index.pug';
document.body.innerHTML = pug.renderFile(pathToIndexPug, { filename: pathToIndexPug });
require('../public/main.ts');
