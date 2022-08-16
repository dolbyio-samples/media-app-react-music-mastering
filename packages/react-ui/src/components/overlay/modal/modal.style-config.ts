import type { ComponentStyleConfig } from '@chakra-ui/theme';

// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
const Modal: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    color: 'base.blue.04.value',
  },
  // Two sizes: sm and md
  sizes: {},
  // Two variants: outline and solid
  variants: {},
  // The default size and variant values
  defaultProps: {},
};

export default Modal;
