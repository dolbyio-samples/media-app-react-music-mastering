import * as ReactDOM from 'react-dom';

import debounce from 'debounce';

import DolbyAppProvider from '@dolby-io-uikit/react-ui/src/components/provider/dolby-app-provider';

import App from './app/app';
import Fonts from './fonts';

import { configureAppStore } from './app/store/configureAppStore';
import { saveState, shouldPersistState } from './app/store/browser-storage';

const store = configureAppStore();

// @ts-ignore: here we subscribe to the store changes
if (shouldPersistState()) {
  store.subscribe(
    // we use debounce to save the state once each 800ms
    // for better performances in case multiple changes occur in a short time
    debounce(() => {
      saveState(store.getState());
    }, 800)
  );
}

ReactDOM.render(
  <DolbyAppProvider store={store}>
    <Fonts />
    <App></App>
  </DolbyAppProvider>,
  document.getElementById('root')
);
