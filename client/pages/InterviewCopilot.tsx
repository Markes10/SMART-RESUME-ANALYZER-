import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Brain, 
  Play, 
  Pause, 
  Square, 
  Mic, 
  MicOff,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Lightbulb,
  Target,
  TrendingUp,
  FileText,
  Star
} from "lucide-react";

interface Question {
  id: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  followUp: string[];
  redFlags: string[];
  goodSigns: string[];
}

interface InterviewSession {
  candidate: string;
  role: string;
  duration: string;
  status: "Not Started" | "In Progress" | "Completed";
  overallScore: number;
  categories: {
    technical: number;
    communication: number;
    cultural: number;
    problemSolving: number;
  };
  biasAlerts: string[];
  recommendations: string[];
}

const questionBank: Question[] = [
  {
    id: "1",
    category: "Technical",
    difficulty: "Medium",
    question: "Can you explain the difference between React hooks and class components?",
    followUp: [
      "Which approach do you prefer and why?",
      "What are the performance implications?",
      "Can you give an example of when you'd use each?"
    ],
    redFlags: [
      "Cannot explain basic concepts",
      "Shows no understanding of modern React"
    ],
    goodSigns: [
      "Clear explanation of differences",
      "Mentions performance benefits",
      "Provides practical examples"
    ]
  },
  {
    id: "2", 
    category: "Behavioral",
    difficulty: "Easy",
    question: "Tell me about a time you had to work with a difficult team member.",
    followUp: [
      "How did you handle the situation?",
      "What was the outcome?",
      "What would you do differently?"
    ],
    redFlags: [
      "Speaks negatively about colleagues",
      "Shows no conflict resolution skills"
    ],
    goodSigns: [
      "Professional approach to conflict",
      "Shows empathy and understanding",
      "Demonstrates growth mindset"
    ]
  },
  {
    id: "3",
    category: "Problem Solving", 
    difficulty: "Hard",
    question: "How would you design a system to handle 1 million concurrent users?",
    followUp: [
      "What are the main bottlenecks?",
      "How would you handle data consistency?",
      "What monitoring would you implement?"
    ],
    redFlags: [
      "No consideration of scalability",
      "Lacks understanding of system design"
    ],
    goodSigns: [
      "Considers multiple approaches",
      "Discusses trade-offs",
      "Mentions real-world constraints"
    ]
  }
];

const mockSession: InterviewSession = {
  candidate: "Alex Johnson",
  role: "Senior Frontend Developer",
  duration: "45 minutes",
  status: "In Progress",
  overallScore: 78,
  categories: {
    technical: 82,
    communication: 75,
    cultural: 80,
    problemSolving: 76
  },
  biasAlerts: [
    "Consider focusing more on technical skills rather than cultural fit",
    "Avoid making assumptions about candidate's background"
  ],
  recommendations: [
    "Ask more specific technical follow-up questions",
    "Explore candidate's problem-solving approach in depth",
    "Discuss team collaboration examples"
  ]
};

export default function InterviewCopilot() {
  const [currentTab, setCurrentTab] = useState("setup");
  const [selectedRole, setSelectedRole] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const startInterview = () => {
    setSessionActive(true);
    setCurrentQuestion(questionBank[0]);
    setCurrentTab("interview");
  };

  const nextQuestion = () => {
    if (questionIndex < questionBank.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(questionBank[questionIndex + 1]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-600";
      case "Medium": return "bg-yellow-100 text-yellow-600";
      case "Hard": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Interview Co-pilot</h1>
          <p className="text-muted-foreground">Real-time AI assistance for conducting effective and unbiased interviews</p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="interview" disabled={!sessionActive}>Live Interview</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!sessionActive}>Analysis</TabsTrigger>
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Interview Setup
              </CardTitle>
              <CardDescription>
                Configure your interview session and let AI assist you throughout the process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="candidate">Candidate Name</Label>
                    <Input
                      id="candidate"
                      placeholder="Enter candidate name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Developer</SelectItem>
                        <SelectItem value="fullstack">Full-Stack Developer</SelectItem>
                        <SelectItem value="designer">UI/UX Designer</SelectItem>
                        <SelectItem value="pm">Product Manager</SelectItem>
                        <SelectItem value="sales">Sales Representative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Expected Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="focus">Interview Focus Areas</Label>
                    <div className="space-y-2 mt-2">
                      {["Technical Skills", "Problem Solving", "Communication", "Cultural Fit", "Leadership"].map((area) => (
                        <label key={area} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border border-input" defaultChecked={area !== "Leadership"} />
                          <span className="text-sm">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={startInterview}
                  disabled={!candidateName || !selectedRole}
                  className="px-8"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Interview Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Interview Panel */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      Live Interview Session
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        23:45
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Candidate: {mockSession.candidate}</span>
                      <Badge className={getDifficultyColor(currentQuestion?.difficulty || "Medium")}>
                        {currentQuestion?.difficulty}
                      </Badge>
                    </div>
                    <div className="text-lg font-medium mb-3">{currentQuestion?.question}</div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={nextQuestion}>
                        Next Question
                      </Button>
                      <Button size="sm" variant="outline">
                        Skip Question
                      </Button>
                    </div>
                  </div>

                  {/* Follow-up Suggestions */}
                  {currentQuestion?.followUp && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Suggested Follow-ups
                      </h4>
                      <div className="space-y-2">
                        {currentQuestion.followUp.map((followUp, index) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-2 border-blue-300">
                            {followUp}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real-time Feedback */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Observations
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Candidate is providing specific examples
                      </div>
                      <div className="flex items-center gap-2 text-sm p-2 bg-yellow-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        Consider asking for more technical depth
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Current Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Real-time Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(mockSession.overallScore)}`}>
                      {mockSession.overallScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(mockSession.categories).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className={getScoreColor(score)}>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bias Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Bias Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockSession.biasAlerts.map((alert, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs p-2 bg-orange-50 rounded border-l-2 border-orange-300">
                        <AlertTriangle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        {alert}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Flag Response
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Red Flag
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Interview Analysis & Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered insights and suggestions based on the interview performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(mockSession.categories).map(([category, score]) => (
                  <div key={category} className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</div>
                    <div className="text-sm font-medium capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Red Flags and Good Signs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Areas of Concern
                  </h4>
                  <div className="space-y-2">
                    {currentQuestion?.redFlags.map((flag, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-2 border-red-300">
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Positive Indicators
                  </h4>
                  <div className="space-y-2">
                    {currentQuestion?.goodSigns.map((sign, index) => (
                      <div key={index} className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                        {sign}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* AI Recommendations */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Recommendations
                </h4>
                <div className="space-y-3">
                  {mockSession.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-medium">{index + 1}</span>
                      </div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  Share Feedback
                </Button>
                <Button variant="outline">
                  Schedule Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Question Bank
              </CardTitle>
              <CardDescription>
                AI-curated questions tailored for different roles and skill levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionBank.map((question) => (
                  <Card key={question.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{question.category}</Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                          </div>
                          <p className="font-medium mb-3">{question.question}</p>
                          <details className="text-sm text-muted-foreground">
                            <summary className="cursor-pointer font-medium">Follow-up Questions</summary>
                            <ul className="mt-2 space-y-1 ml-4">
                              {question.followUp.map((followUp, index) => (
                                <li key={index} className="list-disc">{followUp}</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                        <Button size="sm" variant="outline">
                          Use Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
