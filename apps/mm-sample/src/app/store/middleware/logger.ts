import { isDebouncedAction, logAndDispatchAction } from './middleware.utils';

// @ts-ignore: A middleware which logs dispatched actions and the resulting new state.
const logger = (store) => (dispatch) => (action) => {
  let shouldLog = true;
  if (isDebouncedAction(action)) {
    shouldLog = false;
  }
  let result = shouldLog
    ? logAndDispatchAction({ store, action, dispatch })
    : dispatch(action);
  return result;
};

export default logger;
