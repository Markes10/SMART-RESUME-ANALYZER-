import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingDown, 
  MessageSquare, 
  GraduationCap, 
  FileText, 
  DollarSign, 
  BookOpen, 
  Calendar, 
  Users,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Shield
} from "lucide-react";

const features = [
  {
    name: "AI Résumé-Job Fit Engine",
    description: "Intelligent matching system that analyzes résumés against job requirements using advanced AI algorithms.",
    href: "/resume-fit",
    icon: FileText,
    color: "bg-blue-500",
    stats: "98% accuracy",
  },
  {
    name: "Predictive Turnover & Retention Bot",
    description: "AI-powered analytics to predict employee turnover and recommend retention strategies.",
    href: "/turnover-retention",
    icon: TrendingDown,
    color: "bg-red-500",
    stats: "85% prediction rate",
  },
  {
    name: "AI Interview Co-pilot",
    description: "Real-time AI assistance for conducting more effective and unbiased interviews.",
    href: "/interview-copilot",
    icon: MessageSquare,
    color: "bg-green-500",
    stats: "40% time saved",
  },
  {
    name: "Onboarding Journey Generator",
    description: "Create personalized onboarding experiences tailored to each new hire's role and background.",
    href: "/onboarding",
    icon: GraduationCap,
    color: "bg-purple-500",
    stats: "90% satisfaction",
  },
  {
    name: "Performance Feedback Writer",
    description: "AI-generated performance feedback and development recommendations based on ongoing assessments.",
    href: "/performance",
    icon: FileText,
    color: "bg-orange-500",
    stats: "2x faster reviews",
  },
  {
    name: "Compensation Fairness Analyzer",
    description: "Analyze compensation data to ensure fair and competitive pay across all roles and demographics.",
    href: "/compensation",
    icon: DollarSign,
    color: "bg-emerald-500",
    stats: "100% compliance",
  },
  {
    name: "AI Learning-Path Recommender",
    description: "Personalized learning and development recommendations based on career goals and skill gaps.",
    href: "/learning-paths",
    icon: BookOpen,
    color: "bg-indigo-500",
    stats: "3x skill growth",
  },
  {
    name: "Attendance Anomaly Detector",
    description: "Intelligent detection of attendance patterns and potential issues before they become problems.",
    href: "/attendance",
    icon: Calendar,
    color: "bg-pink-500",
    stats: "95% accuracy",
  },
  {
    name: "Diversity & Inclusion Analytics",
    description: "Comprehensive analytics and insights to promote diversity and inclusion across your organization.",
    href: "/diversity-inclusion",
    icon: Users,
    color: "bg-cyan-500",
    stats: "D&I certified",
  },
];

const stats = [
  {
    name: "AI Accuracy",
    value: "98%",
    description: "Average prediction accuracy across all modules",
    icon: Target,
  },
  {
    name: "Time Saved",
    value: "45%",
    description: "Reduction in manual HR tasks",
    icon: TrendingUp,
  },
  {
    name: "Data Security",
    value: "100%",
    description: "SOC 2 Type II compliant",
    icon: Shield,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                AI-Powered HR Management
              </Badge>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Transform Your HR with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Intelligent Automation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Revolutionize your human resources with our comprehensive suite of AI-powered tools. 
              From recruitment to retention, make data-driven decisions that transform your workforce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-semibold mb-1">{stat.name}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI-Powered HR Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive suite of intelligent tools designed to streamline every aspect of human resources management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.name} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20 hover:from-card hover:to-muted/40">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.stats}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {feature.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link to={feature.href}>
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10 transition-colors">
                        Explore Feature
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
