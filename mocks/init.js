/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
global.fetch = require('jest-fetch-mock');
require('../public/main.ts');
