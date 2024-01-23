import {Card, CardSection, Container, Group, Image, Text} from '@mantine/core';
import { type FC } from 'react';

const HomePage: FC = () => {
  return (
    <Container size="xs" mt={20}>
      <StayUpdated/>
    </Container>
  );
}

function StayUpdated() {
  return (
    <Card>
      <CardSection>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={160}
          alt="Norway"
        />
      </CardSection>

      <Group mt="md" justify="center" mb="xs">
        <Text size="xl" fw={500}>
          Fique por dentro e atualizado
        </Text>
      </Group>

      <Text size="sm" c="dimmed" ta="center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consectetur perferendis
        totam nobis blanditiis ipsam id odit reprehenderit eius nostrum, exercitationem rerum
        perspiciatis nemo voluptas sequi officia sit iusto.
      </Text>
    </Card>
  );
}

export default HomePage;
