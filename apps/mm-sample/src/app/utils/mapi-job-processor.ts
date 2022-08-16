import { RequestCallbacks, RequestParams } from './mapi-job-processor.types';

/**
 * This utility abstracts the MAPI job lifecycle.
 * Not intended to integrate with Dolby API directly and assumes authentication is handled by a client proxy server.
 */
class MapiJobProcessor {
  constructor() {}

  /**
   * Runs through the MAPI job life cycle from start, process and complete
   * @param param0 @param requestParams @see RequestParams defines endpoint and body to process, server is optional (defaults to current hostname)
   * @param param0 @param requestCallbacks @see RequestCallbacks defines callbacks for when the api is in progress (onProgress) and completed (onResponse) and failed (onError)
   * @returns
   */
  async processApiJob({
    requestParams,
    requestCallbacks,
  }: {
    requestParams: RequestParams;
    requestCallbacks?: RequestCallbacks;
  }) {
    const { endpoint, body, server } = requestParams;
    const {
      onResponse = () => {},
      onProgress = () => {},
      onError = () => {},
    } = requestCallbacks || {};
    if (!endpoint || !body) {
      return null;
    }
    try {
      var requestConfig = {
        server,
        endpoint,
        body,
        onProgress,
        onResponse,
        onError,
      };
      return request(requestConfig);
    } catch (error) {
      console.error('Error while making call with info:', {
        requestParams,
        error,
      });
    }
  }
}

export default MapiJobProcessor;

const POLL_INTERVAL = 1000;

const request = async (requestConfig: RequestParams & RequestCallbacks) => {
  const { server = '', endpoint } = requestConfig;
  var apiUrl = server + endpoint;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', apiUrl, true);
  xhr.setRequestHeader('Content-type', 'application/json');

  const apiStatus = (job_id: any) => {
    var url = apiUrl + '?job_id=' + job_id;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
          if (requestConfig.onProgress != undefined) {
            requestConfig.onProgress && requestConfig.onProgress(Number(response.progress));
          }
          if (response.status == 'Pending' || response.status == 'Running') {
            window.setTimeout(apiStatus.bind(null, job_id), POLL_INTERVAL);
          } else {
            requestConfig.onResponse && requestConfig.onResponse(response.status, response);
            return;
          }
        } else {
          requestConfig.onError && requestConfig.onError('Error', response);
          return;
        }
      }
    };
    xhr.send();
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.responseText);
      if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
        var job_id = response.job_id;
        window.setTimeout(apiStatus.bind(null, job_id), POLL_INTERVAL);
      } else {
        requestConfig.onResponse && requestConfig.onResponse('Error', response);
      }
    }
  };
  xhr.send(JSON.stringify(requestConfig.body));
};
