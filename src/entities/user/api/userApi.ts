import { User } from "../model/types";

type FetchUsersProps = {
  select?: (keyof User)[];
};

const fetchUsers = async (props: FetchUsersProps = {}): Promise<User[]> => {
  const queries = props.select?.join(",");
  const response = await fetch(`/api/users?limit=0&select=${queries}`);
  const data = await response.json();
  return data.users;
};

export const userApi = {
  getUsers: fetchUsers,
};