import { useEffect, useState } from 'react';

import {
  Box,
  Slider as ChakraSlider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderProps,
} from '@chakra-ui/react';

const Slider = ({ value, ...props }: SliderProps) => {
  // const [sliderValue, setSliderValue] = useState(value);

  // useEffect(() => {
  //   setSliderValue(value);
  // }, [value]);

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

  return (
    <Box pt={2} pb={6}>
      <ChakraSlider
        {...props}
        value={value}
        aria-label="slider-ex-6"
        onChange={(val) => {
          // setSliderValue(val);
          props.onChange && props.onChange(val);
        }}
      >
        {/* <SliderMark value={25} {...labelStyles}>
          25%
        </SliderMark>
        <SliderMark value={50} {...labelStyles}>
          50%
        </SliderMark>
        <SliderMark value={75} {...labelStyles}>
          75%
        </SliderMark> */}
        <SliderTrack>
          <SliderFilledTrack bg={'base.purple.04.value'} />
        </SliderTrack>
        <SliderThumb bg={'base.gray.06.value'} />

        <SliderMark
          value={value!}
          textAlign="center"
          color="black"
          mt="3"
          ml={value === 0 ? '-6' : '-7'}
          w="12"
        >
          {value}
        </SliderMark>
      </ChakraSlider>
    </Box>
  );
};

export default Slider;
