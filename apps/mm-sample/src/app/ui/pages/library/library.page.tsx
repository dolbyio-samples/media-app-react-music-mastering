import { useEffect } from 'react';

import { VStack, Center } from '@chakra-ui/react';

import useAccount from '../../hooks/account-data.ui-hook';

import MasteringModal from '../../components/mastering-modal/mastering-modal.component';

export const LibraryPage = (props: any) => {
  const { addAccount } = useAccount();

  useEffect(() => {
    addAccount('user-account-id');
  }, []);

  return (
    <VStack w={'6xl'}>
      <Center>
        <MasteringModal></MasteringModal>
      </Center>
    </VStack>
  );
};
