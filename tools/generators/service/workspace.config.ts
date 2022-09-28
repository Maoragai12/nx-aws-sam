/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import { addProjectConfiguration, Tree } from '@nrwl/devkit';

const buildRunCommandConfig = (dir: string, commands: Array<object>) => ({
    executor: '@nrwl/workspace:run-commands',
    outputs: [ '{options.outputPath}' ],
    options: {
        outputPath: `dist/${dir}`,
        commands: commands,
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
                        command: `sam build --template ${serviceRoot}/template.yaml --config-env {args.envType} --beta-features --build-dir=.aws-sam/build/${projectName}-service --debug`,
                    },
                    {
                        command: `rm ${serviceRoot}/package.json`,
                        forwardAllArgs: false,
                    },
                    {
                        command: `cp services/${projectName}-service/samconfig.toml .aws-sam/build/${projectName}-service`,
                        forwardAllArgs: false,
                    },
                ]),
            },
            deploy: {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `sam deploy --template .aws-sam/build/${projectName}-service/template.yaml --config-env {args.envType}`,
                    },
                ]),
            },
        },
    });
};
