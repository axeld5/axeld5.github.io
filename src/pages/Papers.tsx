
import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample papers data - replace with your actual papers
const papers = [
  {
    id: 1,
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    venue: "NIPS 2017",
    summary: "Introduced the Transformer architecture that revolutionized NLP. Key insights on self-attention mechanisms and their superiority over RNNs for sequence modeling.",
    tags: ["Deep Learning", "NLP", "Transformers"],
    url: "https://arxiv.org/abs/1706.03762",
    dateRead: "2024-01-15",
    rating: 5
  },
  {
    id: 2,
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    venue: "NAACL 2019",
    summary: "BERT showed how bidirectional pre-training could significantly improve language understanding tasks. The masked language modeling approach was particularly innovative.",
    tags: ["BERT", "Pre-training", "Language Models"],
    url: "https://arxiv.org/abs/1810.04805",
    dateRead: "2024-01-10",
    rating: 4
  }
];

const Papers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const allTags = Array.from(new Set(papers.flatMap(paper => paper.tags)));

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || paper.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Research Papers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of research papers I've read, along with my thoughts and key takeaways. 
          This helps me remember important insights and track my learning journey.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search papers..."
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

      <div className="grid gap-6">
        {filteredPapers.map(paper => (
          <Card key={paper.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{paper.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {paper.authors} • {paper.venue} • Read on {new Date(paper.dateRead).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{renderStars(paper.rating)}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{paper.summary}</p>
              <div className="flex flex-wrap gap-2">
                {paper.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No papers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Papers;
