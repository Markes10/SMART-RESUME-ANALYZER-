import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Brain, 
  TrendingUp, 
  Target, 
  Star, 
  Users,
  Edit,
  Copy,
  Download,
  Send,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Award,
  BookOpen,
  MessageSquare,
  Eye,
  RefreshCw
} from "lucide-react";

interface PerformanceMetric {
  category: string;
  score: number;
  target: number;
  improvement: number;
  feedback: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  manager: string;
  reviewPeriod: string;
  lastReviewDate: string;
  nextReviewDate: string;
}

interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  tone: "Professional" | "Encouraging" | "Direct" | "Developmental";
  sections: string[];
}

const mockEmployee: Employee = {
  id: "emp001",
  name: "Jordan Smith",
  role: "Senior Software Engineer",
  department: "Engineering",
  manager: "Sarah Johnson",
  reviewPeriod: "Q4 2024",
  lastReviewDate: "2024-01-15",
  nextReviewDate: "2024-04-15"
};

const performanceMetrics: PerformanceMetric[] = [
  {
    category: "Technical Excellence",
    score: 87,
    target: 85,
    improvement: 5,
    feedback: "Demonstrates strong technical skills and consistently delivers high-quality code"
  },
  {
    category: "Collaboration",
    score: 78,
    target: 80,
    improvement: -2,
    feedback: "Good team player but could improve on cross-team communication"
  },
  {
    category: "Innovation",
    score: 92,
    target: 75,
    improvement: 12,
    feedback: "Exceptional at proposing creative solutions and driving innovation"
  },
  {
    category: "Leadership",
    score: 74,
    target: 70,
    improvement: 8,
    feedback: "Shows promising leadership potential, takes initiative on projects"
  },
  {
    category: "Goal Achievement",
    score: 89,
    target: 85,
    improvement: 4,
    feedback: "Consistently meets and exceeds quarterly objectives"
  }
];

const feedbackTemplates: FeedbackTemplate[] = [
  {
    id: "comprehensive",
    name: "Comprehensive Annual Review",
    description: "Full performance review covering all key areas",
    tone: "Professional",
    sections: ["Achievements", "Areas for Growth", "Goal Setting", "Development Plan"]
  },
  {
    id: "quarterly",
    name: "Quarterly Check-in",
    description: "Regular quarterly performance update",
    tone: "Encouraging",
    sections: ["Progress Update", "Recent Accomplishments", "Upcoming Goals"]
  },
  {
    id: "improvement",
    name: "Performance Improvement Plan",
    description: "Focused feedback for performance improvement",
    tone: "Direct",
    sections: ["Performance Gaps", "Improvement Actions", "Support Resources", "Timeline"]
  },
  {
    id: "development",
    name: "Career Development Focus",
    description: "Growth-oriented feedback for high performers",
    tone: "Developmental",
    sections: ["Strengths", "Growth Opportunities", "Skill Development", "Career Path"]
  }
];

const aiGeneratedFeedback = {
  strengths: [
    "Jordan consistently demonstrates exceptional technical expertise in full-stack development, particularly in React and Node.js ecosystems.",
    "Shows strong problem-solving abilities and often proposes innovative solutions that improve team productivity.",
    "Reliable team member who consistently meets deadlines and delivers high-quality work.",
    "Takes initiative in mentoring junior developers and sharing knowledge across the team."
  ],
  improvements: [
    "Could benefit from more proactive communication with stakeholders outside the immediate team.",
    "Consider developing project management skills to better coordinate cross-functional initiatives.",
    "Opportunity to expand leadership presence in architectural decision-making processes."
  ],
  goals: [
    "Lead the implementation of the new microservices architecture initiative",
    "Develop and deliver technical training sessions for the broader engineering team",
    "Improve cross-team collaboration by establishing regular sync meetings with product and design teams"
  ],
  development: [
    "Enroll in advanced system design course to enhance architectural thinking",
    "Participate in leadership training program to develop management skills",
    "Consider obtaining cloud architecture certification (AWS/GCP)"
  ]
};

export default function PerformanceFeedback() {
  const [selectedTemplate, setSelectedTemplate] = useState("comprehensive");
  const [selectedEmployee, setSelectedEmployee] = useState("jordan");
  const [feedbackTone, setFeedbackTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFeedback, setGeneratedFeedback] = useState<string>("");

  const generateFeedback = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const template = feedbackTemplates.find(t => t.id === selectedTemplate);
    let feedback = `Performance Review - ${mockEmployee.name}\n`;
    feedback += `Role: ${mockEmployee.role}\n`;
    feedback += `Review Period: ${mockEmployee.reviewPeriod}\n\n`;
    
    if (template?.sections.includes("Achievements")) {
      feedback += "KEY ACHIEVEMENTS:\n";
      aiGeneratedFeedback.strengths.forEach((strength, index) => {
        feedback += `• ${strength}\n`;
      });
      feedback += "\n";
    }
    
    if (template?.sections.includes("Areas for Growth")) {
      feedback += "AREAS FOR GROWTH:\n";
      aiGeneratedFeedback.improvements.forEach((improvement, index) => {
        feedback += `• ${improvement}\n`;
      });
      feedback += "\n";
    }
    
    if (template?.sections.includes("Goal Setting")) {
      feedback += "UPCOMING GOALS:\n";
      aiGeneratedFeedback.goals.forEach((goal, index) => {
        feedback += `• ${goal}\n`;
      });
      feedback += "\n";
    }
    
    if (template?.sections.includes("Development Plan")) {
      feedback += "DEVELOPMENT RECOMMENDATIONS:\n";
      aiGeneratedFeedback.development.forEach((dev, index) => {
        feedback += `• ${dev}\n`;
      });
    }
    
    setGeneratedFeedback(feedback);
    setIsGenerating(false);
  };

  const getScoreColor = (score: number, target: number) => {
    if (score >= target) return "text-green-600";
    if (score >= target * 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (improvement < 0) return <AlertCircle className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Continuous Performance Feedback Writer</h1>
          <p className="text-muted-foreground">AI-generated performance feedback and development recommendations</p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates & Settings</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Feedback Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Employee</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jordan">Jordan Smith</SelectItem>
                        <SelectItem value="alex">Alex Chen</SelectItem>
                        <SelectItem value="sarah">Sarah Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Review Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedTemplate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {feedbackTemplates.find(t => t.id === selectedTemplate)?.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Feedback Tone</Label>
                    <Select value={feedbackTone} onValueChange={setFeedbackTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Encouraging">Encouraging</SelectItem>
                        <SelectItem value="Direct">Direct</SelectItem>
                        <SelectItem value="Developmental">Developmental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="custom-notes">Additional Context</Label>
                    <Textarea
                      id="custom-notes"
                      placeholder="Add any specific context or focus areas..."
                      className="h-20"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={generateFeedback}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate AI Feedback
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Employee
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Manually
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Generated Feedback Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI-Generated Performance Feedback
                  </CardTitle>
                  <CardDescription>
                    Personalized feedback based on performance data and AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedFeedback ? (
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm font-mono">{generatedFeedback}</pre>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configure settings and click "Generate AI Feedback" to create personalized performance feedback</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Employee Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Overview - {mockEmployee.name}
              </CardTitle>
              <CardDescription>
                {mockEmployee.role} • {mockEmployee.department} • Review Period: {mockEmployee.reviewPeriod}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(performanceMetrics.reduce((sum, m) => sum + m.score, 0) / performanceMetrics.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {performanceMetrics.filter(m => m.score >= m.target).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Goals Met</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {performanceMetrics.filter(m => m.improvement > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Improving Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Q4</div>
                  <div className="text-sm text-muted-foreground">Review Period</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{metric.category}</span>
                        {getImprovementIcon(metric.improvement)}
                        {metric.improvement !== 0 && (
                          <Badge variant={metric.improvement > 0 ? "default" : "destructive"} className="text-xs">
                            {metric.improvement > 0 ? "+" : ""}{metric.improvement}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          Target: {metric.target}
                        </span>
                        <span className={`font-semibold ${getScoreColor(metric.score, metric.target)}`}>
                          {metric.score}
                        </span>
                      </div>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{metric.feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Key Strengths
                  </h4>
                  <div className="space-y-2">
                    {aiGeneratedFeedback.strengths.slice(0, 3).map((strength, index) => (
                      <div key={index} className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Growth Opportunities
                  </h4>
                  <div className="space-y-2">
                    {aiGeneratedFeedback.improvements.map((improvement, index) => (
                      <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-2 border-blue-300">
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Feedback Templates
              </CardTitle>
              <CardDescription>
                Pre-configured templates for different types of performance reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbackTemplates.map((template) => (
                  <Card key={template.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="outline">{template.tone}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Includes:</p>
                            <div className="flex flex-wrap gap-1">
                              {template.sections.map((section, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {section}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm">
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>
                Configure how AI generates and personalizes feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Default Feedback Tone</Label>
                    <Select defaultValue="Professional">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Encouraging">Encouraging</SelectItem>
                        <SelectItem value="Direct">Direct</SelectItem>
                        <SelectItem value="Developmental">Developmental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Feedback Length</Label>
                    <Select defaultValue="Medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brief">Brief (1-2 paragraphs)</SelectItem>
                        <SelectItem value="Medium">Medium (3-4 paragraphs)</SelectItem>
                        <SelectItem value="Detailed">Detailed (5+ paragraphs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Focus Areas (Select multiple)</Label>
                    <div className="space-y-2 mt-2">
                      {["Performance Goals", "Skill Development", "Collaboration", "Leadership", "Innovation"].map((area) => (
                        <label key={area} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border border-input" defaultChecked />
                          <span className="text-sm">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Review History
              </CardTitle>
              <CardDescription>
                Past performance reviews and feedback history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-01-15", type: "Quarterly Review", score: 87, status: "Completed" },
                  { date: "2023-10-15", type: "Annual Review", score: 84, status: "Completed" },
                  { date: "2023-07-15", type: "Mid-year Check-in", score: 82, status: "Completed" },
                  { date: "2023-04-15", type: "Quarterly Review", score: 79, status: "Completed" }
                ].map((review, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{review.type}</p>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <Badge variant={review.status === "Completed" ? "default" : "secondary"}>
                        {review.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{review.score}</p>
                        <p className="text-xs text-muted-foreground">Overall Score</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
