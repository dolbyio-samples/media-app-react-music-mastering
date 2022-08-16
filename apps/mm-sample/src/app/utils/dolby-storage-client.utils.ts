/** This hook can be used in functional components and vanilla JS/TS */
const useDolbyStorage = ({} = {}) => {
  const uploadFile = async (
    key: string,
    file: any,
    { onStart = () => {}, onDone = () => {}, onError = (err: any) => {} }
  ) => {
    onStart();
    const { url } =
      (await fetchDolbyMediaApi({
        endpoint: '/media/input',
        method: 'POST',
        fileId: key,
      })
        .then((resp: any) => resp.json())
        .catch((e) => onError(e))) || {};
    if (!url) {
      onError('Unable to retrieve presigned url');
      return;
    }
    fetch(url, { method: 'PUT', body: file }).then(onDone).catch(onError);
  };

  const getFile = (fileId: string) => {
    return fetchDolbyMediaApi({
      endpoint: '/media/output',
      method: 'GET',
      fileId,
    })
      .then(async (resp) => {
        const blob = await resp.blob();
        return new Promise<{ blob: any; resp: Response }>((resolve) => {
          resolve({ resp, blob });
        });
      })
      .then(({ blob, resp }) => {
        return URL.createObjectURL(
          new Blob([blob], { type: resp.headers.get('Content-Type') || '' })
        );
      });
  };

  const fetchDolbyMediaApi = ({
    endpoint,
    method,
    fileId,
  }: {
    endpoint: string;
    method: string;
    fileId: string;
  }): Promise<Response> => {
    const url = `dlb://${fileId}`;
    const body =
      method === 'GET'
        ? undefined
        : JSON.stringify({
            url,
          });
    const urlSearchParams =
      method === 'GET' ? `?${new URLSearchParams({ url })}` : '';
    return fetch(`${endpoint}${urlSearchParams}`, {
      method,
      headers:
        method === 'GET'
          ? { Accept: 'application/octet-stream' }
          : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body,
    }).catch((e) => e);
  };

  return { uploadFile, getFile };
};

export default useDolbyStorage;
