import { useDispatch, useSelector } from 'react-redux';

import { Box, VStack, HStack } from '@chakra-ui/react';

import { PopoverContent, PopoverArrow, PopoverBody } from '@chakra-ui/react';

import { Icon } from '@dolbyio/media-uikit-react';

import {
  masteringActions,
  MasteringPresets,
  MasteringPresetsMap,
} from 'apps/mm-sample/src/app/store/slices';
import { RootState } from 'apps/mm-sample/src/app/store/configureAppStore';

import { getEnumKey } from 'apps/mm-sample/src/app/utils/enum.utils';

import IconMultiSelectButton from './multi-select/icon-multi-select-button.component';
import MultiSelectGroup, {
  SelectionChangeHandler,
} from './multi-select/multi-select-group.component';
import Tag from './input/tag.component';

const MAX_SELECTIONS = 5;

const PresetMultiSelectGroup = () => {
  const dispatch = useDispatch();
  const presets = useSelector((state: RootState) => state.mastering.presets);

  const handleOnSelectionChange: SelectionChangeHandler = (
    change,
    entities
  ) => {
    const { value, isFocused } = change || {};
    if (isFocused) {
      // Remove from the top of the queue
      if (presets.length >= MAX_SELECTIONS) {
        dispatch(masteringActions.removePreset(presets[0] as MasteringPresets));
      }
      dispatch(masteringActions.addPreset(value as MasteringPresets));
    } else {
      dispatch(masteringActions.removePreset(value as MasteringPresets));
    }
  };

  return (
    <Box>
      <MultiSelectGroup
        onSelectionChange={handleOnSelectionChange}
        maxSelection={MAX_SELECTIONS}
        disableOnMax={false}
      >
        {Object.keys(MasteringPresetsMap).map((preset, index) => {
          const { icon } = MasteringPresetsMap[preset as MasteringPresets];
          const text = getEnumKey(MasteringPresets, preset);
          return (
            <IconMultiSelectButton
              key={index}
              id={text}
              direction={'column'}
              icon={icon}
              text={text}
              value={preset}
              focus={presets.includes(preset as MasteringPresets)}
              style={{
                width: '118px',
                height: '100px',
                maxWidth: '118px',
                maxHeight: '100px',
                focus: {
                  background: `url(${`/assets/svg/${text.toLowerCase()}-focus-background.svg`})`,
                  color: ' #FFFFFF',
                },
                hover: {},
                boxShadow: `0px 4px 8px rgba(0, 0, 0, 0.1)`,
              }}
              popoverElement={(key: string | number) => {
                const { suggestedGenres, description, icon } =
                  MasteringPresetsMap[preset as MasteringPresets];
                return (
                  <PopoverContent padding={4} key={key}>
                    <PopoverArrow />
                    <PopoverBody>
                      <VStack align={'flex-start'}>
                        <HStack>
                          <Box>
                            <Icon icon={icon} />
                          </Box>
                          <Box fontWeight={'bold'}>{text}</Box>
                        </HStack>
                        <Box>{description}</Box>
                        <Box fontWeight={'semibold'}>Suggested genres</Box>
                        <HStack>
                          {suggestedGenres.map((genre, index) => (
                            <Box key={index}>
                              <Tag isReadOnly>{genre}</Tag>
                            </Box>
                          ))}
                        </HStack>
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                );
              }}
            />
          );
        })}
      </MultiSelectGroup>
    </Box>
  );
};

export default PresetMultiSelectGroup;
