import pubSub from "@/helpers/pubSub";

export function checkHttpState(response, next) {
  if(response.state !== 200) {
    pubSub.publish('Error:HTTP.State', response)
    throw Error('Error:HTTP.State');
  }
  return next(response);
}

export function checkJSONCode(response, next) {
  if(response.data.code === 0) {
    return next(response.data);
  }
  const msg = response.data.message;
  pubSub.publish('Error:HTTP.Body.Code', response)
  throw Error(msg);
}

export function getData(response, next) {
  return next(response.data.data);
}
