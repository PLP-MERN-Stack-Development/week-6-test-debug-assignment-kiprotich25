import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { postService } from "@/services/api";
import PostView from "@/components/PostView";

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    postService.getPost(id).then(data => setPost(data));
  }, [id]);

  if (!post) return <p className="text-center mt-10">Loading post...</p>;

  return <PostView post={post} />;
}
