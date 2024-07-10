export type routerConfigType = {
  path: string;
  auth?: string[];
  element?: FC<{}>;
  children?: routerConfigType[] | RouteObject[];
};
