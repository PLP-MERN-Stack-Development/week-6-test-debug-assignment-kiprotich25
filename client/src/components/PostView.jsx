export default function PostView ({ post}) {
    return (
        <div className="max-w-3xl mx-h-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-muted-foreground mb-2">Views: {post.viewCount}</p>
            <p className="text-base">{post.content}</p>
        </div>
    );
}