import './preset-panel.scss';

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Box, VStack } from '@chakra-ui/react';

import { RootState } from '../../../store/configureAppStore';

import PresetLoudnessSelectGroup from '../shared/forms/preset-loudness-select-group.component';
import PresetMultiSelectGroup from '../shared/forms/preset-multi-select-group.component';
import {
  masteringActions,
  MasteringStep,
  tracksActions,
} from '../../../store/slices';

import useTracks from '../../hooks/track-data.ui-hook';

const MasteringModalPresetPanel = () => {
  const dispatch = useDispatch();
  const { rawTrack, trimmedTrack } = useTracks();
  const { presets } = useSelector((state: RootState) => state.mastering);
  const { ids: tracksEntityIds } = useSelector(
    (state: RootState) => state.tracks
  );

  useEffect(() => {
    if (!tracksEntityIds || tracksEntityIds.length <= 1) {
      return;
    }
    // Clean up all tracks other than the raw/trimmed track
    tracksEntityIds
      .filter((id) => id !== rawTrack?.id)
      .filter((id) => id !== trimmedTrack?.id)
      .forEach((id) => {
        dispatch(tracksActions.remove(id));
      });
  }, []);

  useEffect(() => {
    if (!presets || !presets.length) {
      // dispatch action to disable next button for the preset panel page
      dispatch(
        masteringActions.updateCannotProceedStep(MasteringStep.ChoosePresets)
      );
      return;
    }
    // dispatch action to enable next button for the preset panel page
    dispatch(
      masteringActions.updateCanProceedStep(MasteringStep.ChoosePresets)
    );
  }, [presets]);

  return (
    <VStack
      id={'main-view'}
      w={'5xl'}
      spacing={'10'}
      justifyContent={'start'}
      alignItems={'start'}
    >
      <Box
        w={'full'}
        pt={'8'}
        pr={'12'}
        pl={'12'}
        bgColor={'base.gray.02.value'}
      >
        <VStack w={'full'} alignItems={'start'}>
          <Box fontSize={'x-large'} fontWeight={'bold'}>
            Style
          </Box>
          <Box>Choose up to 5 presets</Box>
          <PresetMultiSelectGroup />
        </VStack>
      </Box>
      <VStack w={'full'} alignItems={'start'} pb={'10'} pr={'12'} pl={'12'}>
        <Box fontSize={'x-large'} fontWeight={'bold'}>
          Target
        </Box>
        <PresetLoudnessSelectGroup />
      </VStack>
    </VStack>
  );
};

export default MasteringModalPresetPanel;
