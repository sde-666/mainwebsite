export interface HandlerEvent {
  rawUrl: string;
  rawQuery: string;
  path: string;
  httpMethod: string;
  headers: Record<string, string | undefined>;
  queryStringParameters: Record<string, string | undefined> | null;
  body: string | null;
  isBase64Encoded: boolean;
}

export interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string | boolean>;
  body?: string;
}

export type Handler = (event: HandlerEvent, context: any) => Promise<HandlerResponse>;
