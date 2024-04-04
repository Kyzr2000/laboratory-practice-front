export type routerConfigType = {
  path: string;
  auth?: (number | string)[];
  element?: FC<{}>;
  children?: routerConfigType[] | RouteObject[];
};
