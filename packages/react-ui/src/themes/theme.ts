import { extendTheme } from '@chakra-ui/react';

import { Colors, Gradients } from '@dolby-io-uikit/design-system';

import {
  ButtonStyleConfig,
  InputStyleConfig,
  SelectStyleConfig,
  LinkStyleConfig,
  ProgressStyleConfig,
} from '@dolby-io-uikit/react-ui';

const colors = {
  ...Colors.color,
  ...Gradients.color,
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: 'Avenir Next DemiBold',
    body: 'Avenir Next Regular',
  },
  shadows: { outline: 'none' },
  components: {
    Button: ButtonStyleConfig,
    Input: InputStyleConfig,
    Select: SelectStyleConfig,
    Link: LinkStyleConfig,
    Progress: ProgressStyleConfig,
  },
});

export default theme;
