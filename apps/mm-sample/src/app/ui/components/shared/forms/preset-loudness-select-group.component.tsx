import { useState, useEffect } from 'react';

import { Box, Tab, TabList, Tabs } from '@chakra-ui/react';

import { Icons } from '@dolbyio/media-uikit-react';

import IconMultiSelectButton from './multi-select/icon-multi-select-button.component';
import Slider from './slider/slider.component';
import { useDispatch } from 'react-redux';
import { masteringActions } from 'apps/mm-sample/src/app/store/slices';

const targets = [
  {
    icon: Icons.Soundcloud,
    text: 'Soundcloud',
    loudness: -13,
  },
  {
    icon: Icons.Apple,
    text: 'Apple',
    loudness: -16,
  },
  {
    icon: Icons.Spotify,
    text: 'Spotify',
    loudness: -14,
  },
  {
    icon: Icons.Amazon,
    text: 'Amazon',
    loudness: -13,
  },
  {
    icon: Icons.Youtube,
    text: 'Youtube',
    loudness: -14,
  },
  {
    icon: Icons.Tidal,
    text: 'Tidal',
    loudness: -14,
  },
];

const PresetLoudnessSelectGroup = () => {
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(-13);

  useEffect(() => {
    dispatch(masteringActions.updateLoudness(sliderValue));
  }, []);

  useEffect(() => {
    // Save to store
    dispatch(masteringActions.updateLoudness(sliderValue));
  }, [sliderValue]);

  const handleSliderChange = (value: any) => {
    setSliderValue(value);
    setTabIndex(-1); // Clear out tabs when moving slider
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    setSliderValue(targets[index].loudness);
  };

  return (
    <Box w={'full'}>
      <Tabs
        w={'full'}
        isLazy
        index={tabIndex}
        onChange={handleTabsChange}
        variant={'unstyled'}
      >
        <TabList w={'full'} justifyContent={'space-between'}>
          {targets.map((target, index) => {
            const { icon, text } = target;
            return (
              <Tab style={{ padding: 0, width: '100%' }} key={index}>
                <IconMultiSelectButton
                  id={`${icon}`}
                  style={{
                    width: 148,
                    height: '100%',
                    text: {
                      fontSize: '14px',
                    },
                  }}
                  icon={icon as Icons}
                  text={text as string}
                  value={icon}
                  focus={tabIndex === index}
                />
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
      <Box mt={4}>Loudness</Box>
      <Slider
        w={'40%'}
        min={-48}
        max={0}
        step={1}
        defaultValue={sliderValue}
        value={sliderValue}
        onChange={handleSliderChange}
      />
    </Box>
  );
};

export default PresetLoudnessSelectGroup;
