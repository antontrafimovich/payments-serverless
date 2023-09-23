import * as cdk from "aws-cdk-lib";
import * as gw from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class AuthServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gateway = new gw.RestApi(this, "AtPaymentsAuthApi", {
      defaultCorsPreflightOptions: {
        allowOrigins: gw.Cors.ALL_ORIGINS,
        allowMethods: gw.Cors.ALL_METHODS,
      },
    });

    const authHandler = new lambda.NodejsFunction(this, "AuthHandler", {
      entry: "src/auth/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.NOTION_KEY as string,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,
      },
    });

    const redirectHandler = new lambda.NodejsFunction(this, "RedirectHandler", {
      entry: "src/redirect/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.NOTION_KEY as string,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,
      },
    });

    const authIntegration = new gw.LambdaIntegration(authHandler);
    const authResource = gateway.root.addResource("auth");
    authResource.addMethod("GET", authIntegration);

    const redirectIntegration = new gw.LambdaIntegration(redirectHandler);
    const redirectResource = authResource.addResource("redirect");
    redirectResource.addMethod("GET", redirectIntegration);
  }
}
