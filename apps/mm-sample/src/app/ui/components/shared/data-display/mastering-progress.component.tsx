import React from 'react';

import { VStack, Box, HStack } from '@chakra-ui/react';

import Progress from '@dolby-io-uikit/react-ui/src/components/feedback/progress/progress';

const MasteringProgress: React.FC<{
  progress?: number;
  text: string;
}> = ({ progress, text }) => {
  return (
    <VStack w={'65%'} pt={2} margin={'auto'}>
      <Box>{text}</Box>
      <HStack w={'full'}>
        {progress !== undefined && <Box>{progress}%</Box>}
        <Progress
          isIndeterminate
          width={'full'}
          min={0}
          max={100}
          value={progress}
        ></Progress>
      </HStack>
    </VStack>
  );
};

export default MasteringProgress;
