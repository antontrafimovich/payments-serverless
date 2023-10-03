#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { UserServiceStack } from "../lib/user-service-stack";
import "dotenv/config";

const app = new cdk.App();
new UserServiceStack(app, "UserServiceStack", {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
});
