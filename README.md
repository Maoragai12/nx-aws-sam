

# NX AWS SAM

<p>A Comprehensive Monorepo Starter for Node.js Serverless Applications with AWS SAM and Github Actions Pre-Configured 🚀</p>

![my badge](https://badgen.net/badge/monorepo/NX/blue)
![my badge](https://badgen.net/badge/SAM%20Template/AWS%20SAM/orange)
![my badge](https://badgen.net/badge/serverless/AWS%20SAM/orange)
![my badge](https://badgen.net/badge/Node/>=16.0/green)
![my badge](https://badgen.net/badge/TypeScript/Language)
![my badge](https://badgen.net/badge/ESLint/>=7.0/purple)
![my badge](https://badgen.net/badge/GitHub%20Actions/CI%2FCD/red)

## Features

✔️ NX Monorepo

✔️ Microservices Auto Generators

✔️ Node.js and TypeScript

✔️ Serverless Architecture 

✔️ AWS Lambda 

✔️ AWS SAM and SAM Templates

✔️ Github Actions

✔️ ESLint

✔️ Jest

✔️ Husky

✔️ ESBuild

## Prerequisites

- Node.js
- Docker
- AWS Account
- S3 Bucket for Saving the SAM Artifacts
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

## Getting Started

- Clone the Repository.
- Add your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to the repository secrets under: `Settings` -> `Secrets` -> `Actions` and click the `New repository secret` button. At the end, it should look like that:

<a href="https://ibb.co/vV0g6N7"><img src="https://i.ibb.co/ydHGczw/Screen-Shot-2022-10-04-at-11-29-17.png" alt="Screen-Shot-2022-10-04-at-11-29-17" border="0" width="450"></a>


- Add your S3 bucket for saving SAM artifacts in: 
    - `tools` -> `generators` -> `service` -> `index.ts` and change the value of `samBucketName` to your S3 bucket name.
    - Search for the placeholder `<BUCKET_NAME>` and replace it with your S3 bucket name.
- Run `npm install`.

## Commands

```
// Run all services
npm run lint 
npm run test
npm run build
npm run deploy

// Run only affected services
npm run affected:lint 
npm run affected:test
npm run affected:build
npm run affected:deploy

// Run specific service
nx lint <SERVICE_NAME>
nx test <SERVICE_NAME>
nx build <SERVICE_NAME>
nx deploy <<SERVICE_NAME>
nx remove <SERVICE_NAME>
```
## Generate a Service

Run `npm run generate:service <SERVICE_NAME>` to generate a new service.

For Example: `npm run generate:service auth` will generate a new service under `services` directory that is called `auth-service`. 

![Screen Shot 2022-10-11 at 1 36 48](https://user-images.githubusercontent.com/67845335/194963278-dd84607d-b68a-4937-b6db-e42376223863.jpg)

## Remove a Service

Run `npm run remove <SERVICE_NAME>` to remove an existing service.

**NOTE: This command will also remove the corresponding CloudForamtion stack in AWS.**

> Deletes an AWS SAM application by deleting the AWS CloudFormation stack, the artifacts that were packaged and deployed to Amazon S3 and Amazon ECR, and the AWS SAM template file.

For Example: `npm run remove auth-service` will remove the `auth-service` from the `services` directory and the corresponding AWS CloudFormation stack.

## AWS SAM and SAM Template

AWS SAM and SAM Template (`template.yaml`) allows you to deploy your stack to AWS with ease. It helps you to use ALL AWS resources in the `template.yaml`.
When you will deploy your service, the pipeline will take the build and the `template.yaml` and deploy it to AWS with all the relevant resources that you defined in the template. 

The default `template.yaml` in the project uses the API Gateway resource with `GET` and `POST` methods for each of the Lambda functions:

```yaml
  Events:
    ApiEvent:
      Type: Api
      Properties:
        Path: /
        Method: GET
        RestApiId: !Ref RestApiGateway
```

```yaml
  Events:
    ApiEvent:
      Type: Api
      Properties:
        Path: /
        Method: POST
        RestApiId: !Ref RestApiGateway
```

More about AWS SAM, SAM Templates and AWS resources can be found [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification.html). 

## CI/CD Pipeline with Github Actions

The project contains 3 pre-configured GitHub Actions pipelines:

- **pr**: Triggered by open a PR.
- **dev**: Triggered by push to the dev branch.
- **prod**: Triggered by push to the main branch.

#### The PR pipeline executes the following steps only on the affected services:

- Runs code linting.
- Runs tests.

#### Each environment pipeline (dev/prod) executes the following steps only on the affected services:

- Runs code linting.
- Runs tests.
- Builds the service.
- Deploys the service to AWS.

You can add or modify the workflow files for your needs.

## Manual Deployment

You can deploy your service manually to AWS with the following command:

```bash
$ npm run build <SERVICE_NAME> --  --args='--EnvType=dev'
$ npm run deploy <SERVICE_NAME> --  --args='--EnvType=dev'
```

For Example: `npm run deploy auth-service --  --args='--EnvType=dev'` will deploy ALL the Lambdas of `auth-service` with `dev` prefix. It will create `dev-auth-service` stack, and if we have for example the `CreateUserFunction`, it will create a Lambda that is called `dev-auth-service-CreateUserFunction`.

## Cloud Environment Variables

For the different enviroments (dev, prod, etc), you can use AWS Secret Manager or AWS SSM Parameter Store to store your Lambda/service enviroment variables. You can reference the enviroment variables within your `template.yaml`. In that way, the environment variables will be injected into the Lambda runtime on the deploy process.

For example (notice the `Environment` section):
```yaml
Globals:
  Function:
    Timeout: 3
    MemorySize: 128
    Runtime: nodejs16.x
    Tracing: Active
    AutoPublishAlias: !Ref EnvType
    Architectures:
      - arm64
    Environment:
      Variables:
        TABLE_NAME: '{{resolve:secretsmanager:user-service/prod:SecretString:TABLE_NAME}}'
```

More about referencing enviroment variables within `template.yaml` can be found [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html).

## Local Environment Variables

#### `.env.json` file:

To run your functions locally, each service should have its own `.env.json` file. So in each service directory you should create the `.env.json` file with the following structure:

```json
{
    "Parameters": {}
}
```

For Example:
```json
{
    "Parameters": {
        "TABLE_NAME": "localtable",
        "BUCKET_NAME": "testBucket",
    }
}
```

If you have more than one function in the service/stack, you can define the environment variables for each function in the same file.

For Example:
```json
{
    "GetUserFunction": {
        "TABLE_NAME": "localtable1",
        "BUCKET_NAME": "testBucket1",
    },
    "AddUserFunction": {
        "TABLE_NAME": "localtable2",
        "BUCKET_NAME": "testBucket2",
    }
}
```

When you invoke your service's Lambda funtions locally, it will load the enviroment variables from the `.env.json` file.

#### `.env.template.json` file:

When you generate a new service, it will create also the `.env.template.json` file. The purpose of this file is to share ***only*** the keys of the environment variables between all the developers that work on this project. So, when developer clone the project he will know the environment variables that he should have in the project and ask for the values from other developers.
 
<img width="333" alt="Screen Shot 2022-10-13 at 16 35 57" src="https://user-images.githubusercontent.com/67845335/195611850-77b2f067-190f-4e01-b002-051f5aed95cf.png">

More about local enviroment variables can be found [here](https://docs.amazonaws.cn/en_us/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html).

## Local Development

To make local development and testing of Lambda functions easier, you can invoke Lambda functions locally without deploying them to AWS. Moreover, you can invoke them with different events and resources like API, SQS, etc.

**NOTE: To run/invoke your functions locally, your Docker should be running on your machine.**

#### Build your application by running the following command:

```bash
$ npm run build <SERVICE_NAME>
```

For Example:
```bash
$ npm run build auth-service
```

This command builds any dependencies that your service has, and copies your service source code to folders under `.aws-sam/build` to be zipped and uploaded to Lambda.

#### Generate events like SQS, S3, etc:

You can generate and customize event payloads for a variety of AWS services like API Gateway, Amazon S3, AWS SQS, etc, then, you can use the generated event to invoke the Lambda function. Generate event by running the following command:

```bash
$ npm run generate:event <SERVICE_NAME> sqs receive-message
```

For Example:
```bash
$ npm run generate:event auth-service sqs receive-message
```

The event will be generated in the `event.json` file that in the service directory. More about the different events can be found [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-generate-event.html).

#### Run functions locally and invoke them with the following command:

```bash
$ npm run invoke:lambda <SERVICE_NAME> <FUNCTION_NAME>
```

For Example:
```bash
$ npm run invoke:lambda auth-service GetUserFunction
```

When you run the Lambda locally, it will load the environment variables from the `.env.json` file and use the `event.json` file to invoke the Lambda. 

#### Invoke specific service functions with API call:

To start your function's Amazon API Gateway locally to test HTTP request/response, use the following command:

```bash
$ npm run invoke:api <SERVICE_NAME>
```

For Example:
```bash
$ npm run invoke:api user-service
$ curl http://localhost:3001/
```

When you run this command, it creates a local HTTP server that hosts all of your service functions.

This functionality features hot reloading so that you can quickly develop and iterate over your functions. You do not need to restart/reload while working on your functions, changes will be reflected instantly/automatically. You only need to restart if you update your AWS SAM template.

**NOTE: The port 3001 may be in use in your machine, if so, when running the above command you will get the following error: `OSError: [Errno 48] Address already in use`. All you need to do is change the port in `worksapce.json` to avaliable port and run the command again.**

More about test, debug and invoke functions locally with AWS SAM, can be found [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-start-api.html).

## Further help

- Visit [AWS SAM Documentation](https://aws.amazon.com/serverless/sam/) to learn more about AWS SAM framework
- Visit the [Nx Documentation](https://nx.dev) to learn more
