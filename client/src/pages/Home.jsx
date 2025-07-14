// import { useEffect, useState } from "react";
// import { postService } from "@/services/api";
// import PostList from "@/components/PostList";

// export default function Home() {
//   const [posts, setPosts] = useState([]);

// //   useEffect(() => {
// //     postService.getAllPosts().then(data => setPosts(data.posts || []));
// //     console.log("Fetched posts:", data); 
// //   }, []);

// //   return <PostList posts={posts} />;
// // }
import { useEffect, useState } from "react";
import { postService } from "@/services/api";
import PostList from "@/components/PostList";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const data = await postService.getAllPosts();
      console.log("Fetched posts:", data); // ✅ This will be an array
      setPosts(data); // ✅ set the array directly
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  fetchPosts();
}, []);

  return <PostList posts={posts} />;
}
