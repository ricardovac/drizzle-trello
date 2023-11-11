import { Container, Flex, Text } from "@mantine/core";
import { NavbarLinksGroup } from "./_components/navbar";

export default function Home() {
  return (
    <Container my="md" size="lg">
      <Flex gap="md">
        <NavbarLinksGroup />
        <Text>Vizualizado recentemente</Text>
      </Flex>
    </Container>
  );
}
