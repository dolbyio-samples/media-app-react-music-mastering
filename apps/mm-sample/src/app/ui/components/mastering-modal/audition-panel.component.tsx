import 'apps/mm-sample/src/app/ui/styles/animations.scss';

import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { VStack, Box } from '@chakra-ui/react';

import Slider from '../shared/forms/slider/slider.component';

import { RootState } from '../../../store/configureAppStore';
import {
  masteringActions,
  MasteringApiOptions,
  MasteringPresets,
  MasteringStep,
  tracksActions,
} from '../../../store/slices';

import useTracks from '../../hooks/track-data.ui-hook';
import useMapiClient from '../../hooks/use-mapi-client.ui-hook';

import TrackInput from '../shared/tracks/track-input.component';
import TrackMetadata from '../shared/tracks/track-metadata.component';
import TrackToggle from '../shared/tracks/track-toggle.component';
import MasteringProgress from '../shared/data-display/mastering-progress.component';

const MasteringModalAuditionPanel = () => {
  const dispatch = useDispatch();
  const { rawTrack, trimmedTrack } = useTracks();
  const { presets, selectedPreset, apiIsDone } = useSelector(
    (state: RootState) => state.mastering
  );
  const { getPreviewTrackIds } = useMapiClient();
  const previewTrackIds = getPreviewTrackIds(presets);

  const [sliderValue, setSliderValue] = useState(100);

  useEffect(() => {
    dispatch(masteringActions.updateIntensity(sliderValue));
  }, []);

  useEffect(() => {
    // Save to store
    dispatch(masteringActions.updateIntensity(sliderValue));
  }, [sliderValue]);

  useEffect(() => {
    if (!selectedPreset) {
      // dispatch action to disable next button for the preset panel page
      dispatch(
        masteringActions.updateCannotProceedStep(MasteringStep.Audition)
      );
      return;
    }
    // dispatch action to enable next button for the preset panel page
    dispatch(masteringActions.updateCanProceedStep(MasteringStep.Audition));
  }, [selectedPreset]);

  useEffect(() => {
    if (!apiIsDone) {
      dispatch(masteringActions.disableAllStepTabs());
      return;
    }
    dispatch(masteringActions.enableAllStepTabs());
  }, [apiIsDone]);

  // Step 2: When the API process is done, update state management
  useEffect(() => {
    dispatch(masteringActions.updatePreviewTrackIds(previewTrackIds));

    return () => {
      previewTrackIds.forEach((trackId) => {
        dispatch(tracksActions.remove(trackId));
      });
      dispatch(masteringActions.updatePreviewTrackIds([]));
    };
  }, []);

  const handleSelect = (preset: MasteringPresets | null) => {
    dispatch(masteringActions.updateSelectedPreset(preset));
  };

  const handleSliderChange = (value: any) => {
    setSliderValue(value);
  };
  return (
    <VStack w={'full'} spacing={'10'}>
      {/* Set read only metadata from unprocessed track in the forms */}
      <TrackInput trackId={rawTrack!.id} isReadOnly />
      {presets.length && (
        <Box
          w={'full'}
          pr={'12'}
          pl={'12'}
          className={'expand-fromtop-animation'}
          style={{ ...((!trimmedTrack && { display: 'none' }) || {}) }}
        >
          <TrackToggle
            presets={[...presets].sort()}
            previewTrackIds={previewTrackIds}
            rawTrackId={trimmedTrack?.id!}
            onSelectPreset={handleSelect}
            interact={true}
            loopActive={true}
            previewActive={false}
            hasLoopControl={true}
            variant={MasteringApiOptions.Preview}
          >
            <VStack alignItems={'start'} w={'40%'} pr={'16px'} pl={'16px'}>
              <Box fontWeight={'bold'}>Intensity</Box>
              <Box w={'full'}>
                <Slider
                  w={'100%'}
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={sliderValue}
                  value={sliderValue}
                  onChange={handleSliderChange}
                />
              </Box>
            </VStack>
          </TrackToggle>
        </Box>
      )}
      <Box
        w={'full'}
        pr={'12'}
        pl={'12'}
        className={'expand-fromtop-animation'}
        style={{
          ...((trimmedTrack && { display: 'none' }) || {}),
        }}
      >
        <Box w={'full'} p={'6'} borderRadius={'6px'} backgroundColor={'white'}>
          <MasteringProgress text={'Preparing your track...'} />
        </Box>
      </Box>
      <TrackMetadata track={rawTrack!} isReadOnly />
    </VStack>
  );
};

export default MasteringModalAuditionPanel;
