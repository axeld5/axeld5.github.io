
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample blog posts data (in a real app, this would come from a CMS or API)
const blogPosts = [
  {
    id: 1,
    title: "Building a Real-time Chat App with WebSockets",
    slug: "building-realtime-chat-websockets",
    excerpt: "Exploring the implementation of a real-time chat application using WebSockets, including handling connection management and message broadcasting.",
    content: `
# Building a Real-time Chat App with WebSockets

Real-time communication has become an essential feature in modern web applications. Whether it's a chat application, live notifications, or collaborative editing, WebSockets provide the foundation for bidirectional communication between client and server.

## Why WebSockets?

Traditional HTTP requests follow a request-response pattern where the client initiates communication. However, for real-time features, we need the server to push data to the client immediately when events occur.

WebSockets solve this by establishing a persistent connection that allows both client and server to send data at any time.

## Implementation Overview

Here's how I approached building a real-time chat application:

### 1. Setting up the WebSocket Server

\`\`\`javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
\`\`\`

### 2. Client-side Connection

\`\`\`javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected to chat server');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  displayMessage(message);
};

function sendMessage(text) {
  const message = {
    text,
    timestamp: new Date().toISOString(),
    user: getCurrentUser()
  };
  ws.send(JSON.stringify(message));
}
\`\`\`

## Key Challenges and Solutions

### Connection Management
Managing connections reliably across network interruptions and server restarts required implementing reconnection logic and heartbeat mechanisms.

### Message Ordering
Ensuring messages appear in the correct order for all users required careful timestamp handling and message queuing.

### Scaling Considerations
For production use, consider using Redis for message broadcasting across multiple server instances.

## Conclusion

WebSockets provide a powerful foundation for real-time features. While the basic implementation is straightforward, production applications require careful consideration of connection management, error handling, and scaling strategies.

The complete code for this project is available on [GitHub](https://github.com/yourusername/chat-app).
    `,
    tags: ["WebSockets", "JavaScript", "Real-time"],
    publishDate: "2024-01-20",
    readTime: "8 min read",
    featured: true
  }
  // Add other blog posts here...
];

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Post Not Found</h1>
        <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <Button variant="ghost" asChild className="p-0 h-auto">
          <Link to="/blog" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.publishDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        {/* In a real app, you'd use a markdown parser here */}
        <div className="whitespace-pre-wrap">{post.content}</div>
      </div>

      <footer className="border-t border-border pt-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Thanks for reading! Feel free to reach out if you have any questions or thoughts.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              More Posts
            </Link>
          </Button>
        </div>
      </footer>
    </article>
  );
};

export default BlogPost;
