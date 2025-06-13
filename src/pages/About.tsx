
import { Github, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-muted-foreground">
          YN
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">
          Hello, I'm Your Name
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A passionate developer, researcher, and lifelong learner. 
          I love exploring new technologies, reading research papers, and sharing my experiments through code.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">About Me</h2>
          <div className="prose prose-gray dark:prose-invert">
            <p>
              I'm a software developer with a passion for building meaningful applications 
              and exploring the latest in technology. When I'm not coding, you'll find me 
              reading research papers, experimenting with new frameworks, or writing about 
              my discoveries.
            </p>
            <p>
              This space serves as my digital garden where I share my thoughts on papers 
              I've read, document my experiments, and showcase projects I'm working on.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Skills & Interests</h2>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {["JavaScript", "TypeScript", "React", "Node.js", "Python", "Machine Learning", "Web Development", "Research"].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Get In Touch</h2>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="mailto:your.email@example.com">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
