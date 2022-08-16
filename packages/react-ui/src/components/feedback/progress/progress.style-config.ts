import type { ComponentStyleConfig } from '@chakra-ui/theme';

// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
const Progress: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    track: {
      borderRadius: 'lg',
    },
  },
  // Two sizes: sm and md
  sizes: {},
  // Two variants: outline and solid
  variants: {},
  // The default size and variant values
  defaultProps: {
    isAnimated: true,
    size: 'xs',
  },
};

export default Progress;
