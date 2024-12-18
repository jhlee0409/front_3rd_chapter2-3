import { userQueries } from "@/entities/user/api/user-queries";
import { FetchUsersProps } from "@/entities/user/model/types";
import { useQuery } from "@tanstack/react-query";

export const useQueryUsers = (props: FetchUsersProps) => {
  return useQuery(userQueries.list(props));
};
