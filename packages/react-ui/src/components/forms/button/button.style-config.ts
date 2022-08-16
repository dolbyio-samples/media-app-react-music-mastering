import type { ComponentStyleConfig } from '@chakra-ui/theme';

// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
const Button: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    fontFamily: 'Avenir Next Bold',
    textTransform: 'uppercase',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderRadius: '6px', // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 6, // <-- px is short for paddingLeft and paddingRight
      py: 4, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 8, // <-- these values are tokens from the design system
      py: 6, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    primary: {
      bg: 'base.purple.04.value',
      color: 'base.gray.01.value',
      _disabled: {
        pointerEvents: 'none',
        cursor: 'not-allowed',
      },
      _hover: {
        bg: 'base.purple.06.value',
      },
    },
    secondary: {
      border: '1.5px solid',
      bg: 'base.gray.01.value',
      boxShadow:
        '0px 1.78454px 3.56909px rgba(97, 97, 97, 0.18), 0px 3.56909px 7.13817px rgba(97, 97, 97, 0.18)',
      borderColor: 'base.purple.06.value',
      color: 'base.purple.06.value',
      _hover: {
        borderColor: 'base.purple.05.value',
        color: 'base.purple.05.value',
      },
      _focused: {
        borderColor: 'base.purple.04.value',
        color: 'base.purple.04.value',
      },
      _disabled: {
        color: 'white',
        border: '1.5px solid base.gray.04.value',
        bg: 'base.gray.04.value',
        cursor: 'not-allowed',
        pointerEvents: 'none',
        _hover: {
          color: 'white',
          border: '1.5px solid base.gray.04.value',
          bg: 'base.gray.04.value',
        },
      },
      _dark: {
        border: '1.5px solid',
        borderColor: 'white',
        bg: 'transparent',
        color: 'white',
        _hover: {
          bg: '#B185FF33',
        },
        _disabled: {
          borderColor: 'transparent',
          bg: 'base.gray.04.value',
          _hover: {
            bg: 'base.gray.04.value',
          },
        },
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'primary',
  },
};

export default Button;
