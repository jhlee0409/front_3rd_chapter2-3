import { Comment } from "@/entities/comment/model/types";
import CommentDeleteButton from "@/features/comment/ui/CommentDeleteButton";
import CommentLikeButton from "@/features/comment/ui/CommentLikeButton";
import ModalEditComment from "@/features/comment/ui/modals/ModalEditComment";

type CommentActionsProps = {
  comment: Comment;
  postId: number;
};

const CommentActions = ({ comment, postId }: CommentActionsProps) => {
  return (
    <div className="flex items-center space-x-1">
      <CommentLikeButton comment={comment} postId={postId} />
      <ModalEditComment comment={comment} />
      <CommentDeleteButton comment={comment} postId={postId} />
    </div>
  );
};

export default CommentActions;