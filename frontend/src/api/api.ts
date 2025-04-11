import { AuthApi, ErrorDetail } from './generated';
import { Configuration, FetchAPI, ResponseError } from './generated';

export interface Api {
  auth: AuthApi;
}

const fetchApi: FetchAPI = async (input, init): Promise<Response> => {
  if (!init) init = {};
  init.signal = AbortSignal.timeout(5000);

  const start = Date.now();

  const result = fetch(input, init).catch(async err => {
    if (err instanceof ResponseError) {
      const errDetail = await err.response.json();
      throw new ApiError(errDetail);
    }

    throw new Error('non ErrorDetail error', err);
  });
  const end = Date.now();

  const url = input instanceof Request ? input.url : input;
  console.log(`[FETCH] ${url} took ${end - start}ms to execute`);

  return result;
};

export function newApi(apiBase: string): Api {
  const config = new Configuration({ basePath: apiBase, fetchApi });
  return {
    auth: new AuthApi(config),
  };
}

export class ApiError extends Error {
  override name: 'ApiError' = 'ApiError' as const;
  constructor(public errDetail: ErrorDetail) {
    super();
  }
}
