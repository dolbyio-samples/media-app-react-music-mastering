import { ChakraProvider } from '@chakra-ui/react';

import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import theme from '../../themes/theme';

const DolbyAppProvider = ({
  store,
  children,
}: {
  store: any;
  children: any;
}) => (
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <StrictMode>
        <BrowserRouter>{children}</BrowserRouter>
      </StrictMode>
    </ChakraProvider>
  </Provider>
);

export default DolbyAppProvider;
