import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function PostList ({ posts }) {
    return (
        <div className="grid gap-4 mt-6 px-4 md:grid-cols-2">
            {posts.map (post =>(
                <Card key={post._id}>
                    <CardContent className="p-4">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="text-muted-foreground">{post.content}</p>
                        <Link to={`/posts/${post._id}`} className="text-blue-600 text-sm underline">Read more</Link>

                    </CardContent>
                </Card>
            ))}

        </div>
    )
}