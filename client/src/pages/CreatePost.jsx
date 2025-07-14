import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "@/components/PostForm";
import { postService, categoryService, authService } from "@/services/api";

export default function CreatePost() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser(); // Get logged-in user

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories(); // get from API
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async ({ title, content, category }) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const postData = {
      title,
      content,
      slug,
      category,
      author: user?._id,
    };

    try {
      await postService.createPost(postData);
      navigate("/");
    } catch (err) {
      console.error("Post creation failed:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <PostForm categories={categories} onSubmit={handleSubmit} />
    </div>
  );
}
