
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample blog posts - replace with your actual posts
const blogPosts = [
  {
    id: 1,
    title: "Building a Real-time Chat App with WebSockets",
    slug: "building-realtime-chat-websockets",
    excerpt: "Exploring the implementation of a real-time chat application using WebSockets, including handling connection management and message broadcasting.",
    content: "Full content would go here...",
    tags: ["WebSockets", "JavaScript", "Real-time"],
    publishDate: "2024-01-20",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Experimenting with React Server Components",
    slug: "experimenting-react-server-components",
    excerpt: "A deep dive into React Server Components, their benefits, and practical implementation strategies for modern web applications.",
    content: "Full content would go here...",
    tags: ["React", "Server Components", "Performance"],
    publishDate: "2024-01-15",
    readTime: "12 min read",
    featured: false
  },
  {
    id: 3,
    title: "Machine Learning Model Deployment with Docker",
    slug: "ml-model-deployment-docker",
    excerpt: "Step-by-step guide to containerizing and deploying machine learning models using Docker and creating scalable ML APIs.",
    content: "Full content would go here...",
    tags: ["Machine Learning", "Docker", "Deployment"],
    publishDate: "2024-01-10",
    readTime: "15 min read",
    featured: false
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));
  const featuredPosts = blogPosts.filter(post => post.featured);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  }).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Thoughts, experiments, and discoveries from my journey in software development. 
          Here I document my projects, share learnings, and explore new technologies.
        </p>
      </div>

      {featuredPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Featured Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2">Featured</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-3">
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
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("")}
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredPosts.map(post => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-3">
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
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {filteredPosts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
