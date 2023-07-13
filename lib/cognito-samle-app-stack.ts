import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CognitoSamleAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda
    const inviteUserLambda = new NodejsFunction(this, "inviteUser", {
      entry: "lambda/invite-user.ts",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        REGION: "ap-northeast-1",
      },
    });

    const customMessageTriggerLambda = new NodejsFunction(
      this,
      "customMessageTrigger",
      {
        entry: "lambda/custom-message-trigger.ts",
        runtime: Runtime.NODEJS_18_X,
      }
    );

    // api gateway
    const inviteUserApi = new cdk.aws_apigateway.RestApi(
      this,
      "inviteUserApi",
      {
        deployOptions: {
          dataTraceEnabled: true,
          metricsEnabled: true,
        },
        defaultCorsPreflightOptions: {
          allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
          allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS,
          allowHeaders: cdk.aws_apigateway.Cors.DEFAULT_HEADERS,
          statusCode: 200,
        },
      }
    );

    const inviteUserPath = inviteUserApi.root.addResource("invite-user");
    const integration = new cdk.aws_apigateway.LambdaIntegration(
      inviteUserLambda
    );

    inviteUserPath.addMethod("POST", integration);

    // cognito
    const userPool = new cdk.aws_cognito.UserPool(this, "sampleUserPool", {
      signInAliases: {
        email: true,
      },
      lambdaTriggers: {
        customMessage: customMessageTriggerLambda,
      },
    });

    const userPoolClient = userPool.addClient("client", {
      userPoolClientName: "cognito-sample-app-client",
      preventUserExistenceErrors: true,
      authFlows: {
        adminUserPassword: true,
        userSrp: true,
      },
    });

    const createCognitoUserPermissionPolicy = new cdk.aws_iam.PolicyStatement({
      actions: ["cognito-idp:AdminCreateUser"],
      resources: [userPool.userPoolArn],
    });

    inviteUserLambda.addToRolePolicy(createCognitoUserPermissionPolicy);
    inviteUserLambda.addEnvironment("USER_POOL_ID", userPool.userPoolId);
  }
}
