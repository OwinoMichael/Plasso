import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Terminal, 
  Code2, 
  Users, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Github,
  Play,
  FileCode,
  Globe
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Real-Time Collaboration",
      description: "Code together with your team in real-time. See cursor positions and edits as they happen."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Code Review",
      description: "Get instant feedback and suggestions from our advanced AI code reviewer."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built with performance in mind. No lag, no delays, just pure speed."
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Multi-Language Support",
      description: "Write in Python, JavaScript, Java, C++, and many more languages."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Workspaces",
      description: "Create dedicated workspaces for your team with role-based permissions."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Access Anywhere",
      description: "Work from any device, anywhere in the world. All you need is a browser."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Projects Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Terminal className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">CodeSync</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Powered by AI • Built for Teams</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              Code Together,
              <br />
              <span className="text-primary">Ship Faster</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The collaborative code editor built for modern development teams. 
              Real-time editing, AI-powered reviews, and seamless collaboration.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-200 shadow-xl group"
                onClick={() => navigate('/signup')}
              >
                Start Coding Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 backdrop-blur-sm"
                onClick={() => navigate('/login')}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Visual/Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
            <div className="relative rounded-2xl border border-border/40 overflow-hidden shadow-2xl backdrop-blur-sm bg-card/50 transform hover:scale-[1.02] transition-transform duration-500">
              <div className="p-4 border-b border-border/40 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <FileCode className="w-4 h-4" />
                  <span>main.tsx</span>
                </div>
              </div>
              <div className="p-8 font-mono text-sm space-y-2">
                <div><span className="text-primary">import</span> <span className="text-foreground">React</span> <span className="text-primary">from</span> <span className="text-chart-1">'react'</span>;</div>
                <div className="h-4"></div>
                <div><span className="text-primary">const</span> <span className="text-chart-2">App</span> = () {'=> {'}</div>
                <div className="pl-4"><span className="text-primary">return</span> (</div>
                <div className="pl-8">{'<'}<span className="text-chart-2">div</span> <span className="text-primary">className</span>=<span className="text-chart-1">"app"</span>{'>'}</div>
                <div className="pl-12">{'<'}<span className="text-chart-2">h1</span>{'>'}Hello, CodeSync!</div>
                <div className="pl-8">{'</'}<span className="text-chart-2">div</span>{'>'}</div>
                <div className="pl-4">);</div>
                <div>{'}'};</div>
                
                {/* Cursor animations */}
                <div className="absolute top-33 left-24 flex items-center gap-2 animate-pulse">
                  <div className="w-0.5 h-5 bg-yellow-500"></div>
                  <span className="text-xs text-yellow-500 font-sans mt-[-13px]">You</span>
                </div>
                <div className="absolute top-47 left-32 flex items-center gap-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <div className="w-0.5 h-5 bg-red-500"></div>
                  <span className="text-xs text-red-500 font-sans mt-[-13px]">Alice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-y border-border/40 backdrop-blur-sm bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-2 group hover:scale-110 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need to
              <br />
              <span className="text-primary">build faster</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that help your team collaborate and ship code with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-2xl border border-border/40 backdrop-blur-sm bg-card/50 hover:bg-card/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Join thousands of developers</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold">
            Ready to transform
            <br />
            your workflow?
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start collaborating with your team today. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-200 shadow-xl group"
              onClick={() => navigate('/signup')}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 backdrop-blur-sm"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 backdrop-blur-sm bg-card/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold">CodeSync</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2026 CodeSync. Built with ❤️ for developers.
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;