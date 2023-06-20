type PageDTO<T extends object> = {
  readonly list: T[];
  readonly offset: number;
  readonly limit: number;
  readonly totalCnt: number;
};

export default PageDTO;
