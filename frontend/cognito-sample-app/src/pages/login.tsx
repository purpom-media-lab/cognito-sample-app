import Head from "next/head";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { ReactElement } from "react";
import Layout from "../layout";
import { useRouter } from "next/router";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

Login.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
});

// ----------------------------------------------------------------------

export default function Login() {
  const { push } = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = event.currentTarget.email.value ?? "";
    const password = event.currentTarget.password.value ?? "";

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        // User authentication was successful

        alert("ログインに成功しました。");
        return;
      },

      onFailure: function (err) {
        // User authentication was not successful
        console.error(err);
        alert("ログインに失敗しました。");
        return;
      },

      newPasswordRequired: function (userAttributes, requiredAttributes) {
        push({
          pathname: "/new-password-setting",
          // 要件次第だが、クエリーパラメータに仮パスワードを設定するのはセキュリティ的に良くないかも？暗号化必要？
          query: {
            email: encodeURIComponent(email),
            password: encodeURIComponent(password),
          },
        });
      },
    });
  };
  return (
    <>
      <Head>
        <title>ログインページ</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center">
            ログイン
          </Typography>
          <TextField name="email" placeholder="メールアドレスを入力" required />
          <TextField name="password" placeholder="パスワードを入力" required />
          <Button variant="contained" size="large" type="submit">
            送信
          </Button>
        </Stack>
      </form>
    </>
  );
}
