import { useState } from 'react';

import { Image, Center, VStack, Divider, Box, Link } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { useDispatch } from 'react-redux';

import Button from '@dolby-io-uikit/react-ui/src/components/forms/button/button';

import {
  masteringActions,
  MasteringStep,
  tracksActions,
  TracksEntity,
} from '../../../store/slices';

import MediaUploadForm from '../shared/forms/media-upload-form.component';

const MasteringModalUpload = () => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const onSubmitDone = (trackEntity: TracksEntity) => {
    if (!trackEntity || !trackEntity.id) {
      return;
    }
    dispatch(tracksActions.upsertOne(trackEntity as TracksEntity));
    dispatch(masteringActions.updateTrackId(trackEntity.id));
    dispatch(masteringActions.updateCurrentStep(MasteringStep.Details));
  };

  const inProgress = progress > 0 && progress < 100;
  return (
    <VStack
      width={'full'}
      color="black"
      overflow="hidden"
      bgColor={'white'}
      pt={'24'}
      spacing={'6'}
    >
      <MediaUploadForm
        onSubmitDone={onSubmitDone}
        onProgressChange={setProgress}
        dragAndDrop={true}
      >
        <Image
          style={{
            cursor: inProgress ? 'not-allowed' : 'pointer',
            pointerEvents: inProgress ? 'none' : 'auto',
          }}
          src="/assets/svg/upload.svg"
          margin="auto"
          w={'210px'}
          h={'210px'}
        ></Image>
      </MediaUploadForm>
      <Center fontSize={'x-large'}>Upload your track</Center>
      <Center>Drag and drop files to upload.</Center>
      <Center>
        <MediaUploadForm
          onSubmitDone={onSubmitDone}
          onProgressChange={setProgress}
        >
          <Button width={'100%'} mb={'10'} isLoading={inProgress}>
            ADD TRACK
          </Button>
        </MediaUploadForm>
      </Center>
      <Divider />
      <Center>
        <Box pt={6} pb={10}>
          Upload FLAC, WAV, or ALAC for highest audio quality.{' '}
          <Link
            color={'base.purple.04.value'}
            href="https://docs.dolby.io/media-apis/docs/music-mastering-api-guide"
            isExternal
          >
            Learn more{'  '}
            <ChevronRightIcon w={'6'} h={'6'} ml={'-5px'} mt={'-1px'} />
          </Link>
        </Box>
      </Center>
    </VStack>
  );
};

export default MasteringModalUpload;
