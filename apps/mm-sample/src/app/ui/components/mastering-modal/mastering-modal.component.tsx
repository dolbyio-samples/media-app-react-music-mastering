import { useDisclosure } from '@chakra-ui/hooks';

import { useSelector } from 'react-redux';

import Button from '@dolby-io-uikit/react-ui/src/components/forms/button/button';

import ModalComp, {
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@dolby-io-uikit/react-ui/src/components/overlay/modal/modal';

import { RootState } from '../../../store/configureAppStore';
import { MasteringHeaders } from '../../../store/slices';

import MasteringModalBreadCrumbs from './bread-crumbs.component';

const MasteringModal = ({ onClose = () => {} }) => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure();
  const currentStep = useSelector(
    (state: RootState) => state.mastering.currentStep
  );

  const handleClose = () => {
    onClose();
    onCloseDisclosure();
  };

  return (
    <>
      <Button onClick={onOpen}>Start mastering</Button>

      <ModalComp isOpen={true} onClose={handleClose} size={'5xl'}>
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          {MasteringHeaders[currentStep]!! && (
            <ModalHeader
              fontSize={'2xl'}
              mt={'4'}
              pl={'12'}
              pb={'0'}
              fontWeight={'bold'}
            >
              {MasteringHeaders[currentStep]}
            </ModalHeader>
          )}
          <ModalBody style={{ padding: 0 }} bgColor={'base.gray.02.value'}>
            <MasteringModalBreadCrumbs></MasteringModalBreadCrumbs>
          </ModalBody>
        </ModalContent>
      </ModalComp>
    </>
  );
};

export default MasteringModal;
