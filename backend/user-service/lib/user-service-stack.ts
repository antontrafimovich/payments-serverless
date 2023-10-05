import * as cdk from "aws-cdk-lib";
import * as gw from "aws-cdk-lib/aws-apigateway";
import { Runtime, Function } from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class UserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gateway = new gw.RestApi(this, "AtPaymentsUserApi", {
      defaultCorsPreflightOptions: {
        allowOrigins: gw.Cors.ALL_ORIGINS,
        allowMethods: gw.Cors.ALL_METHODS,
      },
    });

    const googleGetUserHandler = Function.fromFunctionArn(
      this,
      "GoogleGetUserHandler",
      process.env.GOOGLE_GET_USER_HANDLER_FUNCTION_ARN!
    );

    const getUserHandler = new lambda.NodejsFunction(this, "GetUserHandler", {
      entry: "src/get-user/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        GOOGLE_GET_USER_HANDLER_FUNCTION_NAME:
          googleGetUserHandler.functionName,
      },
    });
    googleGetUserHandler.grantInvoke(getUserHandler);

    const getUserIntegration = new gw.LambdaIntegration(getUserHandler);
    const userResource = gateway.root.addResource("user");
    userResource.addMethod("GET", getUserIntegration);
  }
}
