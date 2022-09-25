/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import { addProjectConfiguration, Tree } from '@nrwl/devkit';

const buildRunCommandConfig = (dir: string, command: Array<object>) => ({
    executor: '@nrwl/workspace:run-commands',
    outputs: [ '{options.outputPath}' ],
    options: {
        outputPath: `dist/${dir}`,
        command: command,
        parallel: false,
    },
});

export const addWorkspaceConfig = (
    host: Tree,
    projectName: string,
    serviceRoot: string
) => {
    addProjectConfiguration(host, `${projectName}-service`, {
        root: serviceRoot,
        projectType: 'application',
        sourceRoot: `${serviceRoot}/src`,
        targets: {
            lint: {
                executor: '@nrwl/linter:eslint',
                outputs: [
                    '{options.outputFile}',
                ],
                options: {
                    lintFilePatterns: [ `${serviceRoot}/**/*.ts` ],
                },
            },
            test: {
                executor: '@nrwl/jest:jest',
                outputs: [
                    `coverage/${serviceRoot}`,
                ],
                options: {
                    jestConfig: `${serviceRoot}/jest.config.js`,
                    codeCoverage: true,
                    color: true,
                    passWithNoTests: false,
                },
            },
            build: {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `copy-partial-json -s package.json -t ${serviceRoot}/package.json -k version name dependencies`,
                        forwardAllArgs: false,
                    },
                    {
                        command: `sam build --template ${serviceRoot}/template.yaml --config-env {args.envType} --cached`,
                    },
                    {
                        command: `rm ${serviceRoot}/package.json`,
                        forwardAllArgs: false,
                    },
                ]),
            },
            deploy: {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `sam deploy --template ${serviceRoot}/template.yaml --config-env {args.envType}`,
                    },
                ]),
            },
        },
    });
};
