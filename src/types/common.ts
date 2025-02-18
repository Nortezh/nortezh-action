export interface ResponseError {
  code?: string;
  message?: string;
  items?: string[];
}

export interface ResponseDto<T = unknown> {
  ok: boolean;
  result?: T;
  error?: ResponseError;
}
