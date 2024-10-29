import { Comment, CommentResponse } from "@/entities/comment/model/types";
import { NewComment } from "@/features/comment/model/types";

const fetchComments = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`);
  const data = (await response.json()) as CommentResponse;
  return data.comments;
};

const addComment = async (newComment: NewComment) => {
  const response = await fetch(`/api/comments/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  });
  const data = (await response.json()) as Comment;
  return data;
};

const updateComment = async (comment: Comment) => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  });
  const data = (await response.json()) as Comment;
  return data;
};

const deleteComment = async (id: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });
  return response.ok;
};

const likeComment = async (comment: Comment) => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: comment.likes + 1 }),
  });
  const data = (await response.json()) as Comment;
  return data;
};

export const commentApi = {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
};