import { useQuery } from '../utils/router.utils';

const KEY = 'redux';

export const shouldPersistState = () => {
  const query = useQuery();
  return (
    // @ts-ignore
    process.env.NODE_ENV !== 'production' &&
    query.get('persist-data') === 'true'
  );
};

export function loadState() {
  if (!shouldPersistState()) {
    return undefined;
  }
  try {
    const serializedState = localStorage.getItem(KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

export async function saveState(state: any) {
  if (!shouldPersistState()) {
    return;
  }
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY, serializedState);
  } catch (e) {
    // Ignore
  }
}
