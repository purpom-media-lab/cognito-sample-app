import { APIGatewayEvent } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env["REGION"] || "ap-northeast-1",
});

const adminCreateUser = async (email: string) => {
  try {
    // こちらで生成した仮パスワードを渡すこともできる
    // ref: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html
    const input = {
      UserPoolId: process.env["USER_POOL_ID"], // required
      Username: email, // required
      // TemporaryPassword: 'STRING_VALUE',
    };
    await client.send(new AdminCreateUserCommand(input));
  } catch (err: any) {
    // すでに招待済みのユーザーが存在する場合は、再送信する
    if (err.__type === "UsernameExistsException") {
      const input = {
        UserPoolId: process.env["USER_POOL_ID"], // required
        Username: email as string, // required
        MessageAction: "RESEND",
        // TemporaryPassword: 'STRING_VALUE',
      };
      await client.send(new AdminCreateUserCommand(input));

      return;
    }

    console.error(err);
    throw err;
  }
};

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
    await adminCreateUser(parsedBody.email);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      },
      body: JSON.stringify({ message: "Success" }),
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
