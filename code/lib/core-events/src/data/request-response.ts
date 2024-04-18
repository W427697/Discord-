export type RequestData<Payload = void> = {
  id: string;
  payload: Payload;
};

export type ResponseData<Payload = void> =
  | { id: string; success: true; payload: Payload }
  | { id: string; success: false; error?: string; payload?: Payload };
