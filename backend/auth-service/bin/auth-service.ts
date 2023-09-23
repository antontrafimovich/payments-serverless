#!/usr/bin/env node
import "dotenv/config";
import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { AuthServiceStack } from "../lib/auth-service-stack";

const app = new cdk.App();
new AuthServiceStack(app, "AuthServiceStack", {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
});
