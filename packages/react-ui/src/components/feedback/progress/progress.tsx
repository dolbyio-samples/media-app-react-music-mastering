import React from 'react';

import {
  Progress as ChakraProgress,
  ProgressProps as ChakraProgressProps,
} from '@chakra-ui/react';

import { GradientTypes } from '@dolby-io-uikit/react-ui/src/design-tokens';

import ProgressStyleConfig from './progress.style-config';

const sxFactory = (gradient: string) => ({
  '& > div': {
    background: `gradient.${gradient}.value`,
  },
});

const StylesByGradient = Object.values(GradientTypes).reduce(
  (acc, gradient) => {
    acc[gradient] = sxFactory(gradient);
    return acc;
  },
  {} as any
);
type ProgressProps = ChakraProgressProps & { gradient?: GradientTypes };

const Progress = ({
  gradient = GradientTypes.BlueToPurple,
  ...props
}: ProgressProps) => {
  return (
    <ChakraProgress
      sx={gradient && StylesByGradient[gradient]}
      {...props}
    ></ChakraProgress>
  );
};
export { ProgressProps, ProgressStyleConfig };
export default Progress;
