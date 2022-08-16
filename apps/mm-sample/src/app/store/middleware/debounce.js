import { isDebouncedAction, logAndDispatchAction } from './middleware.utils';

export default () => {
  const timers = {};

  const middleware = (store) => (dispatch) => (action) => {
    const { meta: { debounce = {} } = {}, type } = action;
    const {
      time,
      key = type,
      cancel = false,
      leading = false,
      trailing = true,
    } = debounce;
    const shouldDebounce = isDebouncedAction(action);
    const dispatchNow = leading && !timers[key];

    const later = (resolve) => () => {
      if (trailing && !dispatchNow) {
        resolve(logAndDispatchAction({ store, action, dispatch }));
      }
      timers[key] = null;
    };

    if (!shouldDebounce) {
      return logAndDispatchAction({ store, action, dispatch });
    }

    if (timers[key]) {
      clearTimeout(timers[key]);
      timers[key] = null;
    }

    if (!cancel) {
      return new Promise((resolve) => {
        if (dispatchNow) {
          resolve(logAndDispatchAction({ store, action, dispatch }));
        }
        timers[key] = setTimeout(later(resolve), time);
      });
    }
  };

  middleware._timers = timers;

  return middleware;
};
