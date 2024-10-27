import { NewPost, Post } from "@/pages/PostsManagerPage";
import { Button, Input, Textarea } from "@/shared/ui";
import { Dispatch, SetStateAction, useState } from "react";

type FormAddPostProps = {
  setPosts: Dispatch<SetStateAction<Post[]>>;
  close: () => void;
};

const initialNewPost: NewPost = { title: "", body: "", userId: 1 };

const FormAddPost = ({ setPosts, close }: FormAddPostProps) => {
  const [newPost, setNewPost] = useState(initialNewPost);

  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const data = (await response.json()) as Post;
      setPosts((prev) => [data, ...prev]);
      setNewPost(initialNewPost);
      close();
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  const handleChangePost = (key: keyof NewPost, value: string | number) => {
    setNewPost((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <Input placeholder="제목" value={newPost.title} onChange={(e) => handleChangePost("title", e.target.value)} />
      <Textarea
        rows={30}
        placeholder="내용"
        value={newPost.body}
        onChange={(e) => handleChangePost("body", e.target.value)}
      />
      <Input
        type="number"
        placeholder="사용자 ID"
        value={newPost.userId}
        onChange={(e) => handleChangePost("userId", Number(e.target.value))}
      />
      <Button onClick={addPost}>게시물 추가</Button>
    </div>
  );
};

export default FormAddPost;
