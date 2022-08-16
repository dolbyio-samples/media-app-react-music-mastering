import { Box, Container, VStack } from '@chakra-ui/react';

const ContentCard = ({ title, children, w = '3xl' }: any) => {
  return (
    <Container
      padding="8"
      color="black"
      w={w}
      maxW="6xl"
      borderWidth="0px"
      borderRadius="lg"
      overflow="hidden"
    >
      <VStack alignItems="start">
        <Box fontSize={'2xl'}>{title}</Box>
        <Box w={'full'}>{children}</Box>
      </VStack>
    </Container>
  );
};

export default ContentCard;
