// File-based Data Manager for blog posts and paper reviews
// Uses numbered files: post_1.txt, post_2.txt, etc.
// Title is extracted from first line starting with ##

class FileDataManager {
  constructor() {
    this.blogCache = new Map();
    this.paperCache = new Map();
    this.isLoading = false;
  }

  // Utility function to extract title from content
  extractTitle(content) {
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('## '));
    return titleLine ? titleLine.replace('## ', '').trim() : 'Untitled';
  }

  // Utility function to extract excerpt from content
  extractExcerpt(content) {
    const lines = content.split('\n');
    // Find the first non-empty line after the title that's not a heading
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#') && !line.startsWith('**') && line.length > 10) {
        return line.length > 150 ? line.substring(0, 150) + '...' : line;
      }
    }
    return 'No excerpt available';
  }

  // Utility function to extract video information from content
  extractVideo(content) {
    const lines = content.split('\n');
    
    // Look for a "### Video" section
    const videoSectionIndex = lines.findIndex(line => 
      line.trim().toLowerCase() === '### video' || 
      line.trim().toLowerCase() === '## video'
    );
    
    if (videoSectionIndex !== -1) {
      // Look for the next non-empty line after the video header
      for (let i = videoSectionIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#')) {
          // Check if it's a video file (common video extensions)
          if (line.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
            return {
              filename: line,
              url: `/videos/${line}` // Assuming videos are stored in public/videos/
            };
          }
          // Also support direct URLs
          if (line.startsWith('http') && line.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
            return {
              filename: line.split('/').pop(),
              url: line
            };
          }
        }
      }
    }
    
    // Fallback: look for video files mentioned anywhere in the content
    const videoFilePattern = /(\w+\.(mp4|webm|ogg|mov|avi|mkv))/gi;
    const matches = content.match(videoFilePattern);
    if (matches && matches.length > 0) {
      const filename = matches[matches.length - 1]; // Use the last mentioned video
      return {
        filename: filename,
        url: `/videos/${filename}`
      };
    }
    
    return null;
  }

  // Load post files using manifest approach
  async discoverPostFiles(type) {
    const posts = [];

    try {
      console.log(`Loading ${type} manifest...`);
      
      // First, load the manifest file
      const manifestResponse = await fetch(`/${type}/index.json`);
      if (!manifestResponse.ok) {
        console.log(`No manifest found for ${type}, falling back to discovery mode`);
        return await this.discoverPostFilesLegacy(type);
      }
      
      const manifest = await manifestResponse.json();
      console.log(`Found manifest with ${manifest.posts.length} ${type} posts`);
      
      // Load each post file listed in the manifest
      for (const postInfo of manifest.posts) {
        try {
          const url = `/${type}/${postInfo.filename}`;
          console.log(`Loading: ${url}`);
          
          const response = await fetch(url);
          if (response.ok) {
            const content = await response.text();
            const title = this.extractTitle(content);
            const excerpt = this.extractExcerpt(content);
            const video = this.extractVideo(content);
            
            posts.push({
              id: postInfo.id,
              title,
              excerpt,
              content,
              video,
              filename: postInfo.filename,
              type
            });
            
            console.log(`Successfully loaded: ${postInfo.filename}${video ? ' (with video)' : ''}`);
          } else {
            console.log(`Failed to load ${url}: ${response.status}`);
          }
        } catch (error) {
          console.log(`Error loading ${postInfo.filename}:`, error);
        }
      }
      
    } catch (error) {
      console.log(`Error loading ${type} manifest:`, error);
      return await this.discoverPostFilesLegacy(type);
    }

    console.log(`Loaded ${posts.length} ${type} posts from manifest`);
    return posts;
  }

  // Legacy discovery method (fallback)
  async discoverPostFilesLegacy(type) {
    const posts = [];
    let postNumber = 1;
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 3; // Reduced from 5 to 3

    console.log(`Using legacy discovery for ${type} files...`);

    while (consecutiveFailures < maxConsecutiveFailures && postNumber <= 10) { // Cap at 10 attempts
      try {
        const url = `/${type}/post_${postNumber}.txt`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced timeout to 3 seconds
        
        const response = await fetch(url, { 
          signal: controller.signal,
          cache: 'no-cache'
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const content = await response.text();
          const title = this.extractTitle(content);
          const excerpt = this.extractExcerpt(content);
          const video = this.extractVideo(content);
          
          posts.push({
            id: postNumber,
            title,
            excerpt,
            content,
            video,
            filename: `post_${postNumber}.txt`,
            type
          });
          
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
        }
      } catch (error) {
        consecutiveFailures++;
      }
      
      postNumber++;
    }

    console.log(`Legacy discovery found ${posts.length} ${type} posts`);
    return posts;
  }

  // Load blog posts from public/blog/
  async loadBlogPosts() {
    try {
      const posts = await this.discoverPostFiles('blog');
      
      // Cache the results
      this.blogCache.clear();
      posts.forEach(post => this.blogCache.set(post.id, post));
      
      return posts;
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }

  // Load paper reviews from public/papers/
  async loadPaperPosts() {
    try {
      const papers = await this.discoverPostFiles('papers');
      
      // Cache the results
      this.paperCache.clear();
      papers.forEach(paper => this.paperCache.set(paper.id, paper));
      
      return papers;
    } catch (error) {
      console.error('Error loading paper posts:', error);
      return [];
    }
  }

  // Get all blog posts
  async getBlogPosts() {
    if (this.blogCache.size === 0) {
      await this.loadBlogPosts();
    }
    return Array.from(this.blogCache.values()).sort((a, b) => b.id - a.id); // Sort by ID desc (newest first)
  }

  // Get all paper posts
  async getPaperPosts() {
    if (this.paperCache.size === 0) {
      await this.loadPaperPosts();
    }
    return Array.from(this.paperCache.values()).sort((a, b) => b.id - a.id); // Sort by ID desc (newest first)
  }

  // Get ALL paper posts for search (bypasses pagination cache issues)
  async getAllPaperPostsForSearch() {
    try {
      console.log('Loading ALL papers for search...');
      
      // Get the manifest to know which papers exist
      const manifestResponse = await fetch('/papers/index.json');
      if (!manifestResponse.ok) {
        throw new Error('Could not load papers manifest');
      }
      
      const manifest = await manifestResponse.json();
      console.log(`Found ${manifest.posts.length} papers in manifest`);
      
      // Sort by ID descending (newest first)
      const sortedPosts = manifest.posts.sort((a, b) => b.id - a.id);
      
      // Load ALL papers
      const papers = [];
      for (const postInfo of sortedPosts) {
        try {
          // Check if already cached
          if (this.paperCache.has(postInfo.id)) {
            papers.push(this.paperCache.get(postInfo.id));
            continue;
          }
          
          const url = `/papers/${postInfo.filename}`;
          const response = await fetch(url);
          if (response.ok) {
            const content = await response.text();
            const title = this.extractTitle(content);
            const excerpt = this.extractExcerpt(content);
            const video = this.extractVideo(content);
            
            const paper = {
              id: postInfo.id,
              title,
              excerpt,
              content,
              video,
              filename: postInfo.filename,
              type: 'papers'
            };
            
            // Cache it for future use
            this.paperCache.set(postInfo.id, paper);
            papers.push(paper);
          }
        } catch (error) {
          console.log(`Error loading ${postInfo.filename}:`, error);
        }
      }
      
      console.log(`Loaded ${papers.length} papers for search`);
      return papers;
    } catch (error) {
      console.error('Error loading all papers for search:', error);
      return [];
    }
  }

  // Get paginated paper posts (NEW METHOD)
  async getPaginatedPaperPosts(page = 1, limit = 20) {
    try {
      // First, get the manifest to know which papers exist
      const manifestResponse = await fetch('/papers/index.json');
      if (!manifestResponse.ok) {
        throw new Error('Could not load papers manifest');
      }
      
      const manifest = await manifestResponse.json();
      const totalPosts = manifest.posts.length;
      
      // Sort by ID descending (newest first)
      const sortedPosts = manifest.posts.sort((a, b) => b.id - a.id);
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPostsInfo = sortedPosts.slice(startIndex, endIndex);
      
      console.log(`Loading ${paginatedPostsInfo.length} papers for page ${page}`);
      
      // Load only the papers for this page
      const papers = [];
      for (const postInfo of paginatedPostsInfo) {
        try {
          // Check if already cached
          if (this.paperCache.has(postInfo.id)) {
            papers.push(this.paperCache.get(postInfo.id));
            continue;
          }
          
          const url = `/papers/${postInfo.filename}`;
          const response = await fetch(url);
          if (response.ok) {
            const content = await response.text();
            const title = this.extractTitle(content);
            const excerpt = this.extractExcerpt(content);
            const video = this.extractVideo(content);
            
            const paper = {
              id: postInfo.id,
              title,
              excerpt,
              content,
              video,
              filename: postInfo.filename,
              type: 'papers'
            };
            
            // Cache it for future use
            this.paperCache.set(postInfo.id, paper);
            papers.push(paper);
          }
        } catch (error) {
          console.log(`Error loading ${postInfo.filename}:`, error);
        }
      }
      
      return papers;
    } catch (error) {
      console.error('Error loading paginated papers:', error);
      return [];
    }
  }

  // Get total paper count (NEW METHOD)
  async getPaperCount() {
    try {
      const manifestResponse = await fetch('/papers/index.json');
      if (!manifestResponse.ok) {
        throw new Error('Could not load papers manifest');
      }
      
      const manifest = await manifestResponse.json();
      return manifest.posts.length;
    } catch (error) {
      console.error('Error getting paper count:', error);
      return 0;
    }
  }

  // Get a specific blog post by ID
  async getBlogPost(id) {
    const numericId = parseInt(id);
    if (this.blogCache.has(numericId)) {
      return this.blogCache.get(numericId);
    }
    
    // Try to load specific post if not in cache
    try {
      const response = await fetch(`/blog/post_${numericId}.txt`);
      if (response.ok) {
        const content = await response.text();
        const title = this.extractTitle(content);
        const excerpt = this.extractExcerpt(content);
        const video = this.extractVideo(content);
        
        const post = {
          id: numericId,
          title,
          excerpt,  
          content,
          video,
          filename: `post_${numericId}.txt`,
          type: 'blog'
        };
        
        this.blogCache.set(numericId, post);
        return post;
      }
    } catch (error) {
      console.error(`Error loading blog post ${id}:`, error);
    }
    
    return null;
  }

  // Get a specific paper post by ID
  async getPaperPost(id) {
    const numericId = parseInt(id);
    if (this.paperCache.has(numericId)) {
      return this.paperCache.get(numericId);
    }
    
    // Try to load specific post if not in cache
    try {
      const response = await fetch(`/papers/post_${numericId}.txt`);
      if (response.ok) {
        const content = await response.text();
        const title = this.extractTitle(content);
        const excerpt = this.extractExcerpt(content);
        const video = this.extractVideo(content);
        
        const post = {
          id: numericId,
          title,
          excerpt,
          content,
          video,
          filename: `post_${numericId}.txt`,
          type: 'paper'
        };
        
        this.paperCache.set(numericId, post);
        return post;
      }
    } catch (error) {
      console.error(`Error loading paper post ${id}:`, error);
    }
    
    return null;
  }

  // Find the next available post number for a given type
  async getNextPostNumber(type) {
    const posts = type === 'blog' ? await this.getBlogPosts() : await this.getPaperPosts();
    if (posts.length === 0) {
      return 1;
    }
    
    // Find the highest ID and add 1
    const maxId = Math.max(...posts.map(post => post.id));
    return maxId + 1;
  }

  // Search blog posts
  async searchBlogPosts(query) {
    const posts = await this.getBlogPosts();
    const searchLower = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }

  // Search paper posts
  async searchPaperPosts(query) {
    const posts = await this.getPaperPosts();
    const searchLower = query.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }

  // Generate a new blog post file (for download)
  async generateBlogPost(content) {
    const title = this.extractTitle(content);
    const nextNumber = await this.getNextPostNumber('blog');
    const filename = `post_${nextNumber}.txt`;
    
    return {
      filename,
      content,
      title,
      postNumber: nextNumber,
      downloadUrl: this.createDownloadUrl(content, filename)
    };
  }

  // Generate a new paper post file (for download)
  async generatePaperPost(content) {
    const title = this.extractTitle(content);
    const nextNumber = await this.getNextPostNumber('papers');
    const filename = `post_${nextNumber}.txt`;
    
    return {
      filename,
      content,
      title,
      postNumber: nextNumber,
      downloadUrl: this.createDownloadUrl(content, filename)
    };
  }

  // Create a download URL for a file
  createDownloadUrl(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    return { url, filename };
  }

  // Download a file
  downloadFile(content, filename) {
    const { url, filename: finalFilename } = this.createDownloadUrl(content, filename);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Get statistics
  async getStats() {
    const [blogPosts, paperPosts] = await Promise.all([
      this.getBlogPosts(),
      this.getPaperPosts()
    ]);
    
    return {
      blogCount: blogPosts.length,
      paperCount: paperPosts.length,
      total: blogPosts.length + paperPosts.length
    };
  }

  // Clear cache (force reload)
  clearCache() {
    this.blogCache.clear();
    this.paperCache.clear();
  }

  // Refresh all data
  async refresh() {
    this.clearCache();
    await Promise.all([
      this.loadBlogPosts(),
      this.loadPaperPosts()
    ]);
  }
}

// Export singleton instance
export default new FileDataManager(); 