import React from "react";
import { ChakraProvider, Container, Heading } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Container p={8}>
        <Heading as="h1">Hello World</Heading>
      </Container>
    </ChakraProvider>
  );
}

export default App;
