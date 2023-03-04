export type User = {
  id: string;
  email: string;
  password: string;
  friends: User[];
  enemies: User[];
};
