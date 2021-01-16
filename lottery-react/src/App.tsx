import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import {
  Button,
  ChakraProvider,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import lotteryContract from "./lib/lottery.contract";
import web3 from "./lib/web3";

function App() {
  const [{ manager, players, balance }, setState] = useState({
    manager: "",
    players: [] as string[],
    balance: "",
  });
  const [amountOfEther, setAmountOfEther] = useState<string>("0.1");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await lotteryContract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(amountOfEther, "ether"),
    });
  };

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const accounts = await web3.eth.getAccounts();
    await lotteryContract.methods.pickWinner().send({
      from: accounts[0],
    });
  };

  useEffect(() => {
    const initialize = async () => {
      const manager: string = await lotteryContract.methods.manager().call();
      const players: string[] = await lotteryContract.methods
        .getPlayers()
        .call();
      const balance: string = await web3.eth.getBalance(
        lotteryContract.options.address
      );
      setState({
        manager,
        players,
        balance,
      });
    };
    initialize();
  }, []);

  return (
    <ChakraProvider>
      <Container p={8}>
        <Heading as="h1" mb={8}>
          Lottery Contract
        </Heading>

        <Text>This contract is managed by {manager}.</Text>
        <Text>There are currently {players.length} people entered,</Text>
        <Text>competing to win {web3.utils.fromWei(balance)} ether.</Text>

        <Divider my={4} />

        <form onSubmit={handleSubmit}>
          <Heading as="h2" mb={2}>
            Wanna try your luck?
          </Heading>
          <FormControl mb={2} as="fieldset">
            <FormLabel htmlFor="amount-of-ether">
              Amount of ether to enter
            </FormLabel>
            <NumberInput
              id="amount-of-ether"
              min={0.1}
              step={0.01}
              value={amountOfEther}
              onChange={(value) => setAmountOfEther(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>1 or more ether required.</FormHelperText>
          </FormControl>
          <Button type="submit">Enter</Button>
        </form>

        <Divider my={4} />

        <Heading as="h2" mb={2}>
          Time to pick winner?
        </Heading>
        <Button type="button" onClick={handleClick}>
          Pick a winner
        </Button>
      </Container>
    </ChakraProvider>
  );
}

export default App;
