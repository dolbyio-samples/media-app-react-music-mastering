import 'apps/mm-sample/src/app/ui/styles/animations.scss';

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { VStack, Box } from '@chakra-ui/react';

import { RootState } from '../../../store/configureAppStore';
import { masteringActions, MasteringApiOptions } from '../../../store/slices';

import useTracks from '../../hooks/track-data.ui-hook';
import useMapiClient from '../../hooks/use-mapi-client.ui-hook';

import TrackInput from '../shared/tracks/track-input.component';
import TrackMetadata from '../shared/tracks/track-metadata.component';
import TrackToggle from '../shared/tracks/track-toggle.component';

const MasteringModalMasteredTrackPanel = () => {
  const dispatch = useDispatch();
  const { rawTrack } = useTracks();
  const { selectedPreset } = useSelector((state: RootState) => state.mastering);
  const { getMasterTrackId } = useMapiClient();
  const masteredTrackId = getMasterTrackId();

  useEffect(() => {
    dispatch(masteringActions.updateMasteredTrackId(masteredTrackId));
  }, []);

  return (
    <VStack w={'full'} spacing={'10'}>
      {/* Set read only metadata from unprocessed track in the forms */}
      <TrackInput trackId={rawTrack!.id} isReadOnly />
      {rawTrack && selectedPreset && (
        <Box
          w={'full'}
          pr={'12'}
          pl={'12'}
          className={'expand-fromtop-animation'}
        >
          <TrackToggle
            presets={[selectedPreset!]}
            previewTrackIds={[masteredTrackId]}
            rawTrackId={rawTrack!.id}
            previewActive={false}
            interact={true}
            hasLoopControl={false}
            variant={MasteringApiOptions.Master}
          />
        </Box>
      )}
      {/* Set read only metadata from unprocessed track in the forms */}
      <TrackMetadata track={rawTrack!} isReadOnly />
    </VStack>
  );
};

export default MasteringModalMasteredTrackPanel;
