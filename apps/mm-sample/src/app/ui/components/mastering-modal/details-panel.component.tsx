import 'apps/mm-sample/src/app/ui/styles/animations.scss';

import { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { VStack, Box } from '@chakra-ui/react';

import useTracks from '../../hooks/track-data.ui-hook';

import { masteringActions, MasteringStep } from '../../../store/slices';

import TrackInput from '../shared/tracks/track-input.component';
import TrackMetadata from '../shared/tracks/track-metadata.component';
import Track from '../shared/tracks/track.component';

const MasteringModalDetailsPanel = () => {
  const dispatch = useDispatch();
  const { rawTrack } = useTracks();

  useEffect(() => {
    dispatch(masteringActions.updateCannotProceedStep(MasteringStep.Details));
  }, []);

  const handleReady = () => {
    dispatch(masteringActions.updateCanProceedStep(MasteringStep.Details));
  };

  return (
    <VStack w={'full'} spacing={'8'} padding={'16 32'}>
      <TrackInput trackId={rawTrack!.id} />
      <Box
        w={'full'}
        pr={'12'}
        pl={'12'}
        className={'expand-fromtop-animation'}
      >
        <Track track={rawTrack!} onReady={handleReady}></Track>
      </Box>
      <TrackMetadata track={rawTrack!} />
    </VStack>
  );
};

export default MasteringModalDetailsPanel;
