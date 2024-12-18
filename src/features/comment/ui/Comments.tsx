import CommentActions from "@/features/comment/ui/CommentActions";
import CommentInfo from "@/features/comment/ui/CommentInfo";
import { ModalAddComment } from "@/features/comment/ui/modals/ModalAddComment";

import { Loader } from "@/shared/ui";
import { useQueryComments } from "../api/use-get-comment";

type CommentsProps = {
  postId: number;
};

const Comments = ({ postId }: CommentsProps) => {
  const { data: comments, isLoading: loading } = useQueryComments({ postId });

  if (loading) return <Loader />;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <ModalAddComment postId={postId} />
      </div>
      <div className="space-y-1">
        {comments && comments?.length > 0 ? (
          comments?.map((comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <CommentInfo comment={comment} />
              <CommentActions comment={comment} />
            </div>
          ))
        ) : (
          <p className="flex justify-center px-4 text-sm">등록된 댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
