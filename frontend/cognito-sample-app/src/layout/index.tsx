import { AppBar, Box, Container, Stack, Toolbar } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <AppBar>
        <Toolbar>Cognito Sample App</Toolbar>
      </AppBar>
      <Container component="main">
        <Stack
          sx={{
            m: "auto",
            maxWidth: 400,
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          {children}
        </Stack>
      </Container>
      <Box component="footer">
        <Toolbar sx={{ justifyContent: "center" }}>
          © 2023 Cognito Sample App
        </Toolbar>
      </Box>
    </>
  );
}
