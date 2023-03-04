export interface Repo<T> {
  query(): Promise<T[]>;
  queryId(_id: string): Promise<T>;

  // Create usuario - register
  create(_info: Partial<T>): Promise<T>;
  // For search the login
  search(query: { key: string; value: unknown }): Promise<T[]>;
  update(_info: Partial<T>): Promise<T>;
}
