import * as cdk from "aws-cdk-lib";
import * as gw from "aws-cdk-lib/aws-apigateway";
import { Runtime, Function } from "aws-cdk-lib/aws-lambda";
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

    const googleAuthHandler = Function.fromFunctionArn(
      this,
      "GoogleAuthHandler",
      process.env.GOOGLE_AUTH_LAMBDA_ARN!
    );

    const authHandler = new lambda.NodejsFunction(this, "AuthHandler", {
      entry: "src/auth/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        REGION: process.env.REGION!,
        REDIRECT_TO: "https://7nbmfhr8y9.execute-api.eu-central-1.amazonaws.com/prod/auth/redirect",
        GOOGLE_AUTH_HANDLER_FUNCTION_NAME: googleAuthHandler.functionName,
      },
      bundling: {
        externalModules: ["@aws-sdk/*", "aws-lambda"],
      },
    });
    googleAuthHandler.grantInvoke(authHandler);

    const googleGetTokenHandler = Function.fromFunctionArn(
      this,
      "GoogleGetTokenHandler",
      process.env.GOOGLE_GET_TOKEN_LAMBDA_ARN!
    );

    const redirectHandler = new lambda.NodejsFunction(this, "RedirectHandler", {
      entry: "src/redirect/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        REGION: process.env.REGION!,
        FRONTEND_REDIRECT_URI: process.env.FRONTEND_REDIRECT_URI as string,
        GOOGLE_GET_TOKEN_FUNCTION_NAME: googleGetTokenHandler.functionName,
      },
    });
    googleGetTokenHandler.grantInvoke(redirectHandler);

    const authIntegration = new gw.LambdaIntegration(authHandler);
    const authResource = gateway.root.addResource("auth");
    authResource.addMethod("GET", authIntegration);

    const redirectIntegration = new gw.LambdaIntegration(redirectHandler);
    const redirectResource = authResource.addResource("redirect");
    redirectResource.addMethod("GET", redirectIntegration);
  }
}
