#!/usr/bin/env node
import 'dotenv/config';
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { MapServiceStack } from '../lib/map-service-stack';

const app = new cdk.App();
new MapServiceStack(app, "MapServiceStack", {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
});
