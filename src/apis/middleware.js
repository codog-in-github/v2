import pubSub from "@/helpers/pubSub";
export function checkHttpState(response, next) {
  if(response.status === 401) {
    pubSub.publish('Error:HTTP.Unauthorized', response)
    throw Error('Error:HTTP.Unauthorized');
  }
  if(response.status !== 200) {
    pubSub.publish('Error:HTTP.State', response)
    throw Error('Error:HTTP.State');
  }
  return next(response);
}

export function checkJSONCode(response, next) {
  if(response.data.code !== 200) {
    pubSub.publish('Error:API.Code', response)
    throw Error('Error:API.Code');
  }
  return next(response);
}

export function getRequestJsonBodyData(response, next) {
  return next(response.data.data);
}

/**
 * 
 * @param {import('axios').AxiosResponse} response 
 * @param {* => *} next 
 * @returns 
 */
export function getRequestBodyData(response, next) {
  return next(response.data);
}

/**
 * 
 * @param {import('axios').AxiosRequestConfig} config 
 * @param {*} next 
 * @returns 
 */
export const addAuthorization = (config, next) => {
  const token = localStorage.getItem('token');
  if(token) {
    config.headers.Authorization = `${token}`;
  }
  return next(config);
}
