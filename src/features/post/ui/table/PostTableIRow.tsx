import { Post } from "@/entities/post/model/types";

import PostTableRowActions from "@/features/post/ui/table/PostTableRowActions";
import PostTableRowTags from "@/features/post/ui/table/PostTableRowTags";
import ModalUserInfo from "@/features/user/ui/modals/ModalUserInfo";
import { useQueryParams } from "@/shared/model/useQueryParams";

import { highlightText } from "@/shared/lib/utils";
import { Table } from "@/shared/ui";

import { ThumbsDown, ThumbsUp } from "lucide-react";

type PostTableItemProps = {
  post: Post;
  search: string;
};

const PostTableIRow = ({ post }: PostTableItemProps) => {
  const { queries } = useQueryParams();
  const { search } = queries;

  return (
    <Table.Row key={post.id}>
      <Table.Cell>{post.id}</Table.Cell>
      <Table.Cell>
        <div className="space-y-1">
          <div>{highlightText(post.title, search)}</div>
          <PostTableRowTags post={post} />
        </div>
      </Table.Cell>
      <Table.Cell>
        <ModalUserInfo post={post} />
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes || 0}</span>
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes || 0}</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <PostTableRowActions post={post} />
      </Table.Cell>
    </Table.Row>
  );
};

export default PostTableIRow;