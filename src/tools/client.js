import axios from 'axios';
import { InternalError } from './error';
import { OPCODE } from './opcode';

const clients = {};

export async function getCredentials(serviceId) {
  if (serviceId === 'backoffice') {
    const sessionId = localStorage.getItem('hikick-backoffice-session-id');
    const endpoint =
      window.location.host === 'backoffice.hikick.kr'
        ? 'https://backoffice-api.hikick.kr/v1'
        : 'https://backoffice-api.staging.hikick.kr/v1';

    return { endpoint, sessionId };
  }

  let endpoint;
  let sessionId;
  const client = await getClient('backoffice');
  if (!endpoint) {
    const { data } = await client.get(`/services/${serviceId}`);
    endpoint = data.service.endpoint;
  }

  if (!sessionId) {
    const { data } = await client.get(`/services/${serviceId}/generate`);
    sessionId = data.accessToken;
  }

  return { endpoint, sessionId };
}

export async function getClient(serviceId, quiet = false) {
  const client = axios.create();
  if (serviceId !== 'backoffice' && clients[serviceId]) {
    return clients[serviceId];
  }

  const { sessionId, endpoint } = await getCredentials(serviceId);
  function getInterceptorRequest(config) {
    config.baseURL = endpoint;
    config.headers = { authorization: `Bearer ${sessionId}` };

    return config;
  }

  function getInterceptorResponse(res) {
    if (!quiet && !res) {
      throw new InternalError('서버와 연결할 수 없습니다.');
    }

    const { data } = res;
    if (!quiet && data.opcode !== OPCODE.SUCCESS) {
      throw new InternalError(data.message);
    }

    return res;
  }

  function getInterceptorResponseError(err) {
    if (!quiet && !err.response) {
      throw new InternalError('서버와 연결할 수 없습니다.');
    }

    const { data } = err.response;
    if (data.opcode === OPCODE.SUCCESS) return err;
    if (!quiet) throw new InternalError(data.message);
  }

  client.interceptors.request.use(getInterceptorRequest.bind(this));
  client.interceptors.response.use(
    getInterceptorResponse.bind(this),
    getInterceptorResponseError.bind(this)
  );

  clients[serviceId] = client;
  return client;
}
