import { NewComment } from "@/entities/comment/model/types";

import { Button, Textarea } from "@/shared/ui";

import { useGlobalModal } from "@/shared/model";
import { useState } from "react";
import { useMutateAddComment } from "../../api/use-add-comment";
import { initialNewComment } from "../../config/initialValues";

type FormAddCommentProps = {
  postId: number;
};

const FormAddComment = ({ postId }: FormAddCommentProps) => {
  const { close } = useGlobalModal("addComment");
  const { mutate: addComment } = useMutateAddComment();
  const [newComment, setNewComment] = useState<NewComment>(() => ({ ...initialNewComment, postId }));

  const handleAddComment = async () => {
    addComment(newComment);
    setNewComment(initialNewComment);
    close();
  };

  const handleChangeComment = (key: keyof NewComment, value: string | number) => {
    setNewComment((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="댓글 내용"
        value={newComment.body}
        onChange={(e) => handleChangeComment("body", e.target.value)}
      />
      <Button onClick={handleAddComment}>댓글 추가</Button>
    </div>
  );
};

export default FormAddComment;
