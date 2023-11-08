import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class GoogleServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambda.NodejsFunction(this, "AtPaymentsApiGoogleAuthHandler", {
      entry: "src/auth/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });

    new lambda.NodejsFunction(this, "AtPaymentsApiGoogleGetTokenHandler", {
      entry: "src/get-token/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });

    new lambda.NodejsFunction(this, "AtPaymentsApiGoogleGetUserInfoHandler", {
      entry: "src/get-user/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });

    new lambda.NodejsFunction(this, "AtPaymentsApiGoogleCreateSheetHandler", {
      entry: "src/create-sheet/index.ts",
      handler: "handler",
      timeout: cdk.Duration.seconds(6),
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });

    new lambda.NodejsFunction(this, "AtPaymentsApiGoogleUpdateSheetHandler", {
      entry: "src/update-sheet/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });

    new lambda.NodejsFunction(this, "AtPaymentsApiGoogleGetFileListHandler", {
      entry: "src/get-file-list/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });

    new lambda.NodejsFunction(
      this,
      "AtPaymentsApiGoogleGetFileContentHandler",
      {
        entry: "src/get-file-content/index.ts",
        handler: "handler",
        runtime: Runtime.NODEJS_18_X,
        environment: {
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    );

    new lambda.NodejsFunction(this, "AtPaymentsApiGoogleRefreshTokenHandler", {
      entry: "src/refresh-token/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });
  }
}
