import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class GoogleServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const authHandler = new lambda.NodejsFunction(
      this,
      "AtPaymentsApiGoogleAuthHandler",
      {
        entry: "src/auth/index.ts",
        handler: "handler",
        runtime: Runtime.NODEJS_18_X,
        environment: {
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    );
  }
}
