import { Html, Head, Main, NextScript } from "next/document";
import Container from "@mui/material/Container";
import NavBar from "@/components/NavBar";

export default function Document() {
  return (
    <Html lang="en">
      <Head />

      <body>
        <Container maxWidth="xl">
          <Main />
          <NextScript />
        </Container>
      </body>
    </Html>
  );
}
