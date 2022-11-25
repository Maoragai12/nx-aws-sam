
const { nxPreset } = require('@nrwl/jest/preset/index.js');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.base.json');

module.exports = {
    ...nxPreset,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: process.cwd(),
    }),
};
