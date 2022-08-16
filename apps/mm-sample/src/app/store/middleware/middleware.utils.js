export const isDebouncedAction = (action) => {
  const { meta: { debounce = {} } = {}, type } = action;

  const {
    time,
    key = type,
    cancel = false,
    leading = false,
    trailing = true,
  } = debounce;

  return ((time && key) || (cancel && key)) && (trailing || leading);
};

export const logAndDispatchAction = ({ store, action, dispatch }) => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = dispatch(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
