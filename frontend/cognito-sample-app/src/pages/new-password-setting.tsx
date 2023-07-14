import Head from "next/head";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { ReactElement } from "react";
import Layout from "../layout";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

NewPasswordSetting.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
});

// ----------------------------------------------------------------------

export default function NewPasswordSetting() {
  const { push } = useRouter();

  const handleSubmit = async (event: any) => {
    if (event.currentTarget.newPassword.value.length < 8) {
      alert("パスワードは8文字以上で入力してください。");
      return;
    }

    event.preventDefault();

    const email = event.currentTarget.email.value ?? "";
    const oldPassword = event.currentTarget.oldPassword.value ?? "";
    const newPassword = event.currentTarget.newPassword.value ?? "";

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: oldPassword,
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
        delete userAttributes.email_verified;
        delete userAttributes.email;

        cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
          onSuccess: function (result) {
            // User authentication was successful

            alert("パスワードの更新に成功しました。");
            push("/");
          },

          onFailure: function (err) {
            // User authentication was not successful
            console.error(err);
            alert("パスワードの更新に失敗しました。");
            return;
          },
        });
      },
    });
  };

  return (
    <>
      <Head>
        <title>パスワード更新ページ</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center">
            パスワード更新
          </Typography>
          <TextField name="email" placeholder="メールアドレスを入力" required />
          <TextField
            name="oldPassword"
            placeholder="仮パスワードを入力"
            required
          />
          <TextField
            name="newPassword"
            placeholder="新しいパスワードを入力"
            required
          />
          <Button variant="contained" size="large" type="submit">
            送信
          </Button>
        </Stack>
      </form>
    </>
  );
}
