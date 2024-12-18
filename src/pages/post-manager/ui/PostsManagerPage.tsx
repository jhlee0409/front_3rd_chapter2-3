import ModalAddPost from "@/features/post/ui/modals/ModalAddPost";

import { Card } from "@/shared/ui";

import ProductSearchFilter from "@/widgets/post/ui/ProductSearchFilter";
import TablePosts from "@/widgets/post/ui/TablePosts";

const PostsManager = () => {
  return (
    <Card.Container className="w-full max-w-6xl mx-auto">
      <Card.Header>
        <Card.Title className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <ModalAddPost />
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-4">
          <ProductSearchFilter />
          <TablePosts />
        </div>
      </Card.Content>
    </Card.Container>
  );
};

export default PostsManager;
