import { useSelector, useDispatch } from 'react-redux';

import {
  accountActions,
  selectDefaultAccount,
} from '../../store/slices/account/account.slice';

const useAccount = () => {
  const dispatch = useDispatch();
  let matchedAccount = useSelector(selectDefaultAccount);

  const { name, rawDataPrefix, previewDataPrefix, masterDataPrefix } =
    matchedAccount || {};

  const buildFilepathPrefix = (accountId: string, suffix = 'raw') => {
    return `${accountId}/data/${suffix}`;
  };

  const addAccount = (accountId: string, makeActive = true) => {
    const payload = {
      id: accountId,
      rawDataPrefix: buildFilepathPrefix(accountId, 'raw'),
      previewDataPrefix: buildFilepathPrefix(accountId, 'preview'),
      masterDataPrefix: buildFilepathPrefix(accountId, 'master'),
    };
    dispatch(accountActions.add(payload));
    if (makeActive) {
      dispatch(accountActions.updateSelectedAccount(accountId));
    }
  };

  return {
    name,
    rawDataPrefix,
    previewDataPrefix,
    masterDataPrefix,
    addAccount,
  };
};

export default useAccount;
