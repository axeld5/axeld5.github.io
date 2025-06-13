
import { useState } from "react";
import { Plus, Save, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const DevMode = () => {
  const [activeTab, setActiveTab] = useState("blog");
  const { toast } = useToast();

  // Blog post form state
  const [blogPost, setBlogPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    featured: false
  });

  // Paper form state
  const [paper, setPaper] = useState({
    title: "",
    authors: "",
    venue: "",
    summary: "",
    tags: "",
    url: "",
    rating: 5
  });

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate the blog post object
    const newPost = {
      ...blogPost,
      id: Date.now(),
      slug: blogPost.slug || blogPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      tags: blogPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      publishDate: new Date().toISOString().split('T')[0],
      readTime: `${Math.ceil(blogPost.content.split(' ').length / 200)} min read`
    };

    // In a real app, this would save to a database or file system
    console.log('New blog post:', newPost);
    
    // Show success message with code
    toast({
      title: "Blog Post Created!",
      description: "Copy the JSON below and add it to your blog posts array.",
    });

    // Reset form
    setBlogPost({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
      featured: false
    });
  };

  const handlePaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate the paper object
    const newPaper = {
      ...paper,
      id: Date.now(),
      tags: paper.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      dateRead: new Date().toISOString().split('T')[0],
      rating: Number(paper.rating)
    };

    // In a real app, this would save to a database or file system
    console.log('New paper:', newPaper);
    
    // Show success message
    toast({
      title: "Paper Added!",
      description: "Copy the JSON below and add it to your papers array.",
    });

    // Reset form
    setPaper({
      title: "",
      authors: "",
      venue: "",
      summary: "",
      tags: "",
      url: "",
      rating: 5
    });
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            DEV MODE
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Development Mode</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create new blog posts and add papers to your reading list. This page is only visible when running locally.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blog" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>New Blog Post</span>
          </TabsTrigger>
          <TabsTrigger value="paper" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Add Paper</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Blog Post</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below to create a new blog post. The generated JSON will be logged to the console.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={blogPost.title}
                      onChange={(e) => setBlogPost(prev => ({
                        ...prev,
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      }))}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <Input
                      value={blogPost.slug}
                      onChange={(e) => setBlogPost(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Excerpt</label>
                  <Textarea
                    value={blogPost.excerpt}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the post..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={blogPost.content}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your blog post content here..."
                    rows={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    value={blogPost.tags}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="React, JavaScript, Tutorial"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={blogPost.featured}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured Post</label>
                </div>

                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Create Blog Post
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paper" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Research Paper</span>
              </CardTitle>
              <CardDescription>
                Add a new paper to your reading list with your thoughts and rating.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaperSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={paper.title}
                    onChange={(e) => setPaper(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Paper title"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Authors</label>
                    <Input
                      value={paper.authors}
                      onChange={(e) => setPaper(prev => ({ ...prev, authors: e.target.value }))}
                      placeholder="Author names"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Venue</label>
                    <Input
                      value={paper.venue}
                      onChange={(e) => setPaper(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="Conference/Journal and year"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Summary & Thoughts</label>
                  <Textarea
                    value={paper.summary}
                    onChange={(e) => setPaper(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Your thoughts on the paper, key insights, etc."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma-separated)</label>
                    <Input
                      value={paper.tags}
                      onChange={(e) => setPaper(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Deep Learning, NLP, Computer Vision"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={paper.rating}
                      onChange={(e) => setPaper(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    type="url"
                    value={paper.url}
                    onChange={(e) => setPaper(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://arxiv.org/abs/..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Add Paper
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevMode;
