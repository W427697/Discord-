import type { Channel } from '@storybook/channels';
import type { RequestData, ResponseData } from '@storybook/core-events';

class RequestResponseError extends Error {}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const experimental_requestResponse = <RequestPayload, ResponsePayload = void>(
  channel: Channel,
  requestEvent: string,
  responseEvent: string,
  payload: RequestPayload,
  timeout = 5000
): Promise<ResponsePayload> => {
  let timeoutId: NodeJS.Timeout;

  return new Promise((resolve, reject) => {
    const request: RequestData<typeof payload> = {
      id: Math.random().toString(16).slice(2),
      payload,
    };

    const responseHandler = (response: ResponseData<ResponsePayload>) => {
      if (response.id !== request.id) return;
      clearTimeout(timeoutId);
      channel.off(responseEvent, responseHandler);
      if (response.success) resolve(response.payload);
      else reject(new RequestResponseError(response.error));
    };

    channel.emit(requestEvent, request);
    channel.on(responseEvent, responseHandler);

    timeoutId = setTimeout(() => {
      channel.off(responseEvent, responseHandler);
      reject(new RequestResponseError('Timed out waiting for response'));
    }, timeout);
  });
};
