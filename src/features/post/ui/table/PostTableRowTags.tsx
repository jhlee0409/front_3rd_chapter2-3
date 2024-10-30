import { Post } from "@/entities/post/model/types";
import { useNavigator } from "@/shared/lib/useNavigator";
import { useFilterTagPosts } from "../../api/use-filter-tag-post";

type PostTableRowTagsProps = {
  post: Post;
};

const PostTableRowTags = ({ post }: PostTableRowTagsProps) => {
  const { queries, handleUpdateQuery } = useNavigator();
  const { tag: selectedTag } = queries;
  const { mutate: filterTagPosts } = useFilterTagPosts();

  return (
    <div className="flex flex-wrap gap-1">
      {post.tags.map((tag) => (
        <span
          key={tag}
          className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
            tag === selectedTag
              ? "text-white bg-blue-500 hover:bg-blue-600"
              : "text-blue-800 bg-blue-100 hover:bg-blue-200"
          }`}
          onClick={async () => {
            handleUpdateQuery("tag", tag);
            filterTagPosts(tag);
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default PostTableRowTags;
