// @ts-nocheck
// An enhancer which logs the time taken for the reducers to process each action.
const round = (number) => Math.round(number * 100) / 100;

const monitorReducersEnhancer =
  (createStore) => (reducer, initialState, enhancer) => {
    const monitoredReducer = (state, action) => {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = round(end - start);

      console.log('reducer process time:', diff);

      return newState;
    };

    return createStore(monitoredReducer, initialState, enhancer);
  };

export default monitorReducersEnhancer;
