import axios from 'axios';
import { InternalError } from './error';
import { OPCODE } from './opcode';

const clients = {};

export async function getCredentials(serviceId) {
  const sessionId = localStorage.getItem(`hikick-${serviceId}-session-id`);
  const endpoint = localStorage.getItem(`hikick-${serviceId}-endpoint`);
  if (sessionId && endpoint) return { sessionId, endpoint };
  if (serviceId === 'backoffice') {
    const endpoint =
      window.location.host === 'backoffice.hikick.kr'
        ? 'https://backoffice-api.hikick.kr/v1'
        : 'https://backoffice-api.staging.hikick.kr/v1';

    localStorage.setItem(`hikick-${serviceId}-endpoint`, endpoint);
    return { endpoint, sessionId };
  }

  const client = await getClient('backoffice');
  if (!endpoint) {
    const { data } = await client.get(`/services/${serviceId}`);
    localStorage.setItem(`hikick-${serviceId}-endpoint`, data.service.endpoint);
  }

  if (!sessionId) {
    const { data } = await client.get(`/services/${serviceId}/generate`);
    localStorage.setItem(`hikick-${serviceId}-session-id`, data.accessToken);
  }
}

export async function getClient(serviceId) {
  const client = axios.create();
  if (clients[serviceId]) {
    console.log('캐시됨!', serviceId);
    return clients[serviceId];
  }

  await getCredentials(serviceId);
  const sessionKey = `hikick-${serviceId}-session-id`;
  const endpointKey = `hikick-${serviceId}-endpoint`;
  function getInterceptorRequest(config) {
    const sessionId = localStorage.getItem(sessionKey);
    const endpoint = localStorage.getItem(endpointKey);
    config.baseURL = endpoint;
    config.headers = { authorization: `Bearer ${sessionId}` };

    return config;
  }

  function getInterceptorResponse(res) {
    if (!res) {
      throw new InternalError('서버와 연결할 수 없습니다.');
    }

    const { data } = res;
    if (data.opcode !== OPCODE.SUCCESS) {
      throw new InternalError(data.message);
    }

    return res;
  }

  function getInterceptorResponseError(err) {
    if (!err.response) {
      throw new InternalError('서버와 연결할 수 없습니다.');
    }

    const { data } = err.response;
    if (data.opcode === OPCODE.SUCCESS) return err;
    throw new InternalError(data.message);
  }

  client.interceptors.request.use(getInterceptorRequest.bind(this));
  client.interceptors.response.use(
    getInterceptorResponse.bind(this),
    getInterceptorResponseError.bind(this)
  );

  clients[serviceId] = client;
  return client;
}
