import { APIGatewayEvent } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env["REGION"] || "ap-northeast-1",
});

export const handler = async (event: APIGatewayEvent) => {
  const parsedBody = JSON.parse(event.body || "");
  if (!parsedBody.email) {
    return {
      statusCode: 400,
      body: {
        errors: [
          {
            message: "missing email parameter",
          },
        ],
      },
    };
  }

  if (!process.env["USER_POOL_ID"]) {
    return {
      statusCode: 500,
      body: {
        errors: [
          {
            message: "missing USER_POOL_ID environment variable",
          },
        ],
      },
    };
  }

  try {
    const input = {
      UserPoolId: process.env["USER_POOL_ID"], // required
      Username: parsedBody.email as string, // required
    };
    await client.send(new AdminCreateUserCommand(input));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
      },
      body: JSON.stringify({ "message": "Success" })
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: {
        errors: [
          {
            message: error.message,
          },
        ],
      },
    };
  }
};
