import { Comment, CommentResponse } from "@/entities/comment/model/types";
import { Post, PostsResponse } from "@/entities/post/model/types";
import { User } from "@/entities/user/model/types";
import { SelectedCommentProvider } from "@/features/comment/model/SelectedCommentContext";
import FilterOrder from "@/features/filter/ui/FilterOrder";
import FilterSort from "@/features/filter/ui/FilterSort";
import FilterTags from "@/features/filter/ui/FilterTags";
import { SelectedPostProvider } from "@/features/post/model/SelectedPostContext";
import SearchInput from "@/features/search/ui/SearchInput";
import { SelectedUserProvider } from "@/features/user/model/SelectedUserContext";
import { highlightText } from "@/shared/lib/utils";
import { Button, Card } from "@/shared/ui";
import Pagination from "@/shared/ui/Pagination";
import { ModalAddComment } from "@/widgets/comment/ui/ModalAddComment";
import ModalEditComment from "@/widgets/comment/ui/ModalEditComment";
import ModalAddPost from "@/widgets/post/ui/ModalAddPost";
import TablePosts from "@/widgets/post/ui/TablePosts";
import { ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type UsersResponse = {
  users: User[];
};

export type NewComment = {
  body: string;
  postId: number | null;
  userId: number;
};

export type NewPost = {
  title: string;
  body: string;
  userId: number;
};

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  // post
  const [posts, setPosts] = useState<Post[]>([]);

  // pagination
  const [total, setTotal] = useState(0);

  // filter
  const queryParams = new URLSearchParams(location.search);
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "");
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");

  // loading
  const [loading, setLoading] = useState(false);

  // comments
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set("skip", skip.toString());
    if (limit) params.set("limit", limit.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (selectedTag) params.set("tag", selectedTag);
    navigate(`?${params.toString()}`);
  };

  //! 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true);
    let postsData: PostsResponse;
    let usersData: Pick<User, "id" | "username" | "image">[];

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data;
        return fetch("/api/users?limit=0&select=username,image");
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users;
        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.find((user) => user.id === post.userId),
        }));

        setPosts(postsWithUsers);
        setTotal(postsData.total);
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`);
      const data = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    }
    setLoading(false);
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ]);
      const postsData = (await postsResponse.json()) as PostsResponse;
      const usersData = (await usersResponse.json()) as UsersResponse;

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    }
    setLoading(false);
  };

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
    }
  };

  //! 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      const data = (await response.json()) as CommentResponse;
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    const comment = comments[postId]?.find((c) => c.id === id);
    if (!comment) return;
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comment.likes + 1 }),
      });
      const data = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? data : comment)),
      }));
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
    }
  };

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get("skip") || "0"));
    setLimit(parseInt(params.get("limit") || "10"));
    setSearchQuery(params.get("search") || "");
    setSortBy(params.get("sortBy") || "");
    setSortOrder(params.get("sortOrder") || "asc");
    setSelectedTag(params.get("tag") || "");
  }, [location.search]);

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        {/* 댓글 추가 대화상자 */}
        <ModalAddComment setComments={setComments} postId={postId} />
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              {/* 댓글 수정 대화상자 */}
              <ModalEditComment setComments={setComments} comment={comment} />
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <SelectedPostProvider>
      <SelectedCommentProvider>
        <SelectedUserProvider>
          <Card.Container className="w-full max-w-6xl mx-auto">
            <Card.Header>
              <Card.Title className="flex items-center justify-between">
                <span>게시물 관리자</span>
                {/* 게시물 추가 대화상자 */}
                <ModalAddPost setPosts={setPosts} />
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-4">
                {/* 검색 및 필터 컨트롤 */}
                <div className="flex gap-4">
                  <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchPosts={searchPosts} />
                  <FilterTags
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    fetchPostsByTag={fetchPostsByTag}
                    updateURL={updateURL}
                  />
                  <FilterSort sortBy={sortBy} setSortBy={setSortBy} />
                  <FilterOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
                </div>
                {/* 게시물 테이블 */}
                {loading ? (
                  <div className="flex justify-center p-4">로딩 중...</div>
                ) : (
                  // 게시물 테이블 렌더링
                  <TablePosts
                    posts={posts}
                    searchQuery={searchQuery}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    updateURL={updateURL}
                    fetchComments={fetchComments}
                    renderComments={renderComments}
                    setPosts={setPosts}
                    deletePost={deletePost}
                  />
                )}
                {/* 페이지네이션 */}
                <Pagination size={limit} setSize={setLimit} page={skip} setPage={setSkip} total={total} />
              </div>
            </Card.Content>
          </Card.Container>
        </SelectedUserProvider>
      </SelectedCommentProvider>
    </SelectedPostProvider>
  );
};

export default PostsManager;
