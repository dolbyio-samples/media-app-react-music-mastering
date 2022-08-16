import type { ComponentStyleConfig } from '@chakra-ui/theme';

// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
const Input: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {},
  // Two sizes: sm and md
  sizes: {},
  // Two variants: outline and solid
  variants: {},
  // The default size and variant values
  defaultProps: {
    focusBorderColor: 'base.purple.01.value',
  },
};

export default Input;
