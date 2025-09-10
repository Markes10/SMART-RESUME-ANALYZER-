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
  GraduationCap, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Users,
  MapPin,
  Briefcase,
  Award,
  MessageSquare,
  FileText,
  Video,
  Coffee,
  Building,
  Target,
  Lightbulb,
  TrendingUp,
  Play,
  Download
} from "lucide-react";

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  type: "meeting" | "training" | "document" | "system" | "social";
  duration: string;
  priority: "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Completed";
  assignedTo: string;
  dueDate: string;
  resources: string[];
  prerequisites: string[];
}

interface OnboardingPlan {
  employeeName: string;
  role: string;
  department: string;
  startDate: string;
  manager: string;
  buddy: string;
  totalTasks: number;
  completedTasks: number;
  estimatedDuration: string;
  currentWeek: number;
}

const mockPlan: OnboardingPlan = {
  employeeName: "Emma Wilson",
  role: "Frontend Developer",
  department: "Engineering",
  startDate: "2024-02-15",
  manager: "Sarah Johnson",
  buddy: "Alex Chen",
  totalTasks: 24,
  completedTasks: 8,
  estimatedDuration: "4 weeks",
  currentWeek: 2
};

const onboardingTasks: OnboardingTask[] = [
  {
    id: "1",
    title: "IT Setup & Equipment",
    description: "Receive laptop, set up accounts, install required software",
    type: "system",
    duration: "2 hours",
    priority: "High",
    status: "Completed",
    assignedTo: "IT Department",
    dueDate: "2024-02-15",
    resources: ["Equipment checklist", "Software installation guide"],
    prerequisites: []
  },
  {
    id: "2",
    title: "Welcome Meeting with Manager",
    description: "Initial welcome meeting to discuss role expectations and goals",
    type: "meeting",
    duration: "1 hour",
    priority: "High",
    status: "Completed",
    assignedTo: "Sarah Johnson",
    dueDate: "2024-02-15",
    resources: ["Welcome packet", "Role expectations document"],
    prerequisites: ["IT Setup & Equipment"]
  },
  {
    id: "3",
    title: "Company Culture Training",
    description: "Learn about company values, mission, and culture",
    type: "training",
    duration: "3 hours",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "HR Department",
    dueDate: "2024-02-16",
    resources: ["Culture handbook", "Values video series"],
    prerequisites: []
  },
  {
    id: "4",
    title: "Team Introduction Session",
    description: "Meet team members and understand team dynamics",
    type: "social",
    duration: "1.5 hours",
    priority: "High",
    status: "Not Started",
    assignedTo: "Sarah Johnson",
    dueDate: "2024-02-16",
    resources: ["Team directory", "Project overview"],
    prerequisites: ["Welcome Meeting with Manager"]
  },
  {
    id: "5",
    title: "Technical Onboarding",
    description: "Set up development environment and review tech stack",
    type: "training",
    duration: "4 hours",
    priority: "High",
    status: "Not Started",
    assignedTo: "Alex Chen",
    dueDate: "2024-02-17",
    resources: ["Dev setup guide", "Architecture documentation"],
    prerequisites: ["IT Setup & Equipment"]
  },
  {
    id: "6",
    title: "First Week Coffee Chat",
    description: "Informal chat with buddy to discuss progress and questions",
    type: "social",
    duration: "30 minutes",
    priority: "Medium",
    status: "Not Started",
    assignedTo: "Alex Chen",
    dueDate: "2024-02-19",
    resources: [],
    prerequisites: ["Team Introduction Session"]
  }
];

const weeklyMilestones = [
  {
    week: 1,
    title: "Foundation & Setup",
    description: "Complete basic setup, meet key people, understand company culture",
    tasks: 8,
    completed: 8,
    keyActivities: ["IT Setup", "Manager Meeting", "Culture Training", "Team Intros"]
  },
  {
    week: 2,
    title: "Technical Immersion",
    description: "Dive into technical aspects, set up development environment",
    tasks: 6,
    completed: 0,
    keyActivities: ["Tech Setup", "Code Review", "Architecture Overview", "First Commits"]
  },
  {
    week: 3,
    title: "Project Integration",
    description: "Join active projects, participate in team ceremonies",
    tasks: 6,
    completed: 0,
    keyActivities: ["Sprint Planning", "Project Assignment", "Pair Programming", "Code Reviews"]
  },
  {
    week: 4,
    title: "Independence & Growth",
    description: "Take ownership of tasks, plan future development",
    tasks: 4,
    completed: 0,
    keyActivities: ["Solo Tasks", "Performance Review", "Goal Setting", "Feedback Session"]
  }
];

export default function OnboardingJourney() {
  const [selectedEmployee, setSelectedEmployee] = useState("emma");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("");
  const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "In Progress": return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="h-4 w-4" />;
      case "training": return <GraduationCap className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      case "system": return <Building className="h-4 w-4" />;
      case "social": return <Coffee className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-600";
      case "Medium": return "bg-yellow-100 text-yellow-600";
      case "Low": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const progressPercentage = (mockPlan.completedTasks / mockPlan.totalTasks) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-lg">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Onboarding Journey Generator</h1>
          <p className="text-muted-foreground">Create personalized onboarding experiences for new hires</p>
        </div>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Journey</TabsTrigger>
          <TabsTrigger value="timeline">Timeline & Milestones</TabsTrigger>
          <TabsTrigger value="resources">Resources & Materials</TabsTrigger>
          <TabsTrigger value="create">Create New Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Employee Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {mockPlan.employeeName} - {mockPlan.role}
                </CardTitle>
                <Badge variant="secondary">{mockPlan.department}</Badge>
              </div>
              <CardDescription>
                Started {mockPlan.startDate} • Week {mockPlan.currentWeek} of 4
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockPlan.completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockPlan.totalTasks - mockPlan.completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockPlan.estimatedDuration}</div>
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Manager: {mockPlan.manager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Buddy: {mockPlan.buddy}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Onboarding Tasks
              </CardTitle>
              <CardDescription>
                Track progress through personalized onboarding activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(task.type)}
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignedTo}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                4-Week Onboarding Timeline
              </CardTitle>
              <CardDescription>
                Structured milestones and activities for optimal onboarding experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklyMilestones.map((milestone) => (
                  <div key={milestone.week} className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                        milestone.week <= mockPlan.currentWeek ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        {milestone.week}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{milestone.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {milestone.completed}/{milestone.tasks} tasks completed
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{milestone.description}</p>
                        <Progress 
                          value={(milestone.completed / milestone.tasks) * 100} 
                          className="mb-3 h-2" 
                        />
                        <div className="flex flex-wrap gap-2">
                          {milestone.keyActivities.map((activity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {milestone.week < weeklyMilestones.length && (
                      <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Documents & Guides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Employee Handbook</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Company Policies</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Benefits Overview</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Code of Conduct</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Video className="h-5 w-5" />
                  Training Videos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Company Overview</span>
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Safety Training</span>
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tool Training</span>
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Culture Videos</span>
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5" />
                  System Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Setup</span>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Slack Workspace</span>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Project Management</span>
                  <Badge className="bg-yellow-100 text-yellow-600">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Development Tools</span>
                  <Badge className="bg-yellow-100 text-yellow-600">Pending</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Recommended Resources
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on role and learning preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Technical Learning Path</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Customized learning resources for Frontend Developer role
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">• React Advanced Patterns Course</div>
                    <div className="text-sm">• TypeScript Best Practices</div>
                    <div className="text-sm">• CSS Architecture Guide</div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">Team Integration</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Activities to help integrate with the Engineering team
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">• Weekly team coffee chats</div>
                    <div className="text-sm">• Pair programming sessions</div>
                    <div className="text-sm">• Sprint planning participation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Create New Onboarding Journey
              </CardTitle>
              <CardDescription>
                Generate a personalized onboarding plan using AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="employee-name">Employee Name</Label>
                    <Input
                      id="employee-name"
                      placeholder="Enter new employee name"
                      value={newEmployeeName}
                      onChange={(e) => setNewEmployeeName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Select value={newEmployeeRole} onValueChange={setNewEmployeeRole}>
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
                        <SelectItem value="marketing">Marketing Specialist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Manager</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                        <SelectItem value="lisa">Lisa Rodriguez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Onboarding Buddy</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign buddy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alex">Alex Chen</SelectItem>
                        <SelectItem value="emma">Emma Davis</SelectItem>
                        <SelectItem value="david">David Park</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Experience Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="special-requirements">Special Requirements</Label>
                    <Textarea
                      id="special-requirements"
                      placeholder="Any special accommodations or requirements..."
                      className="h-20"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-base font-medium">AI Customization Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Focus Areas</Label>
                    <div className="space-y-2">
                      {["Technical Skills", "Team Integration", "Company Culture", "Tools & Systems", "Project Onboarding"].map((area) => (
                        <label key={area} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border border-input" defaultChecked />
                          <span className="text-sm">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Learning Preferences</Label>
                    <div className="space-y-2">
                      {["Video Tutorials", "Documentation", "Hands-on Practice", "Mentoring Sessions", "Group Training"].map((pref) => (
                        <label key={pref} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border border-input" />
                          <span className="text-sm">{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  disabled={!newEmployeeName || !newEmployeeRole}
                  className="px-8"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate AI Journey
                </Button>
                <Button size="lg" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
