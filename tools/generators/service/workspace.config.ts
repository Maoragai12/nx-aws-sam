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
    serviceRoot: string,
    bucketName: string
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
                        command: `sam build --template ${serviceRoot}/template.yaml --parameter-overrides EnvType={args.EnvType} --beta-features --build-dir=.aws-sam/build/${projectName}-service --debug`,
                    },
                ]),
            },
            deploy: {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `sam deploy --template .aws-sam/build/${projectName}-service/template.yaml --stack-name {args.EnvType}-${projectName}-service --s3-prefix {args.EnvType}-${projectName}-service --s3-bucket ${bucketName} --region us-east-1 --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset --parameter-overrides EnvType={args.EnvType}`,
                    },
                ]),
            },
            'generate:event': {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `sam local generate-event > services/${projectName}-service/event.json`,
                    },
                ]),
            },
            'invoke:lambda': {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `sam local invoke --template .aws-sam/build/${projectName}-service/template.yaml --event services/${projectName}-service/event.json --env-vars services/${projectName}-service/.env.json --debug`,
                    },
                ]),
            },
            'invoke:api': {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `sam local start-api --template .aws-sam/build/${projectName}-service/template.yaml --env-vars services/${projectName}-service/.env.json --port 3001 --debug`,
                    },
                ]),
            },
            remove: {
                ...buildRunCommandConfig(serviceRoot, [
                    {
                        command: `nx g remove ${projectName}-service`,
                    },
                    {
                        command: `sam delete --stack-name {args.EnvType}-${projectName}-service --s3-prefix {args.EnvType}-${projectName}-service --s3-bucket ${bucketName} --region us-east-1 --no-prompts --debug`,
                    },
                ]),
            },
        },
    });
};
