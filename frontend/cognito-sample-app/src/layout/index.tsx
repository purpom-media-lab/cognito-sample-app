import { AppBar, Box, Container, Stack, Toolbar } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <AppBar>
        <Toolbar>Cognito Sample App</Toolbar>
      </AppBar>
      <Container component="main" sx={{ width: "100%", height: "100%" }}>
        <Stack
          sx={{
            width: "100%",
            height: "100%",
            maxWidth: 400,
            m: "auto",
            justifyContent: "center",
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
    </Box>
  );
}
