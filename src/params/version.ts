export function match(param: string) {
  return param.match(/(v.*|latest|dev)/);
};