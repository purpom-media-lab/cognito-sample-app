import Head from "next/head";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { ReactElement } from "react";
import Layout from "../layout";

// ----------------------------------------------------------------------

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Index() {
  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/invite-user`;

      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: event.currentTarget.email.value,
        }),
      });

      alert("招待メールを送信しました。");
    } catch (err) {
      console.error(err);
      alert("招待に失敗しました。");
    }
  };

  return (
    <>
      <Head>
        <title>招待ページ</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center">
            ユーザー招待
          </Typography>
          <TextField name="email" placeholder="メールアドレスを入力" required />
          <Button variant="contained" size="large" type="submit">
            送信
          </Button>
        </Stack>
      </form>
    </>
  );
}
