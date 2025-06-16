const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for React dev server (typically runs on port 3000)
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json({ limit: '10mb' }));

// Write post file and update manifest
app.post('/api/write-post', async (req, res) => {
  try {
    const { type, content, filename, postNumber } = req.body;
    
    if (!type || !content || !filename || !postNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const publicDir = path.join(__dirname, '..', 'public', type);
    
    // Ensure directory exists
    await fs.mkdir(publicDir, { recursive: true });
    
    // Write the post file
    const postPath = path.join(publicDir, filename);
    await fs.writeFile(postPath, content, 'utf8');
    
    // Read existing manifest or create new one
    const manifestPath = path.join(publicDir, 'index.json');
    let manifest = { posts: [] };
    
    try {
      const existingManifest = await fs.readFile(manifestPath, 'utf8');
      manifest = JSON.parse(existingManifest);
    } catch (error) {
      // File doesn't exist or is invalid, use empty manifest
      console.log('Creating new manifest file');
    }
    
    // Check if post already exists (update scenario)
    const existingPostIndex = manifest.posts.findIndex(p => p.id === postNumber);
    
    if (existingPostIndex >= 0) {
      // Update existing post
      manifest.posts[existingPostIndex] = {
        id: postNumber,
        filename: filename
      };
    } else {
      // Add new post
      manifest.posts.push({
        id: postNumber,
        filename: filename
      });
    }
    
    // Sort posts by ID
    manifest.posts.sort((a, b) => a.id - b.id);
    
    // Write updated manifest
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    
    console.log(`Successfully wrote ${type} post: ${filename} (#${postNumber})`);
    
    res.json({
      success: true,
      message: `${type} post saved successfully`,
      filename,
      postNumber,
      manifestUpdated: true
    });
    
  } catch (error) {
    console.error('Error writing post:', error);
    res.status(500).json({ 
      error: 'Failed to write post', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dev server is running' });
});

app.listen(PORT, () => {
  console.log(`🛠️  Dev file server running on http://localhost:${PORT}`);
  console.log(`📝 Use this to write posts directly to the file system`);
  console.log(`🔗 Make sure your React app is running on http://localhost:3000`);
}); 