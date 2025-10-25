import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Users,
  Eye,
  Bell,
  BarChart3,
  Filter,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Activity,
  MapPin,
  Timer,
  Target,
  Zap,
  Mail
} from "lucide-react";

interface AttendanceAnomaly {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: "Late Arrival" | "Early Departure" | "Extended Break" | "Absence Pattern" | "Weekend Activity";
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  detectedAt: string;
  impact: string;
  pattern: string;
  frequency: number;
  recommendation: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  attendanceScore: number;
  punctualityRate: number;
  absenceRate: number;
  avgHoursPerWeek: number;
  recentAnomalies: number;
  trend: "improving" | "stable" | "declining";
}

interface AttendanceMetrics {
  department: string;
  totalEmployees: number;
  presentToday: number;
  onTimeRate: number;
  avgWorkHours: number;
  absenceRate: number;
  anomaliesDetected: number;
}

const attendanceAnomalies: AttendanceAnomaly[] = [
  {
    id: "1",
    employeeId: "emp001",
    employeeName: "Alex Thompson",
    department: "Engineering",
    type: "Late Arrival",
    severity: "Medium",
    description: "Consistently arriving 20-30 minutes late for the past week",
    detectedAt: "2024-02-20 09:30",
    impact: "Team standup meetings delayed",
    pattern: "Daily pattern, Monday-Friday",
    frequency: 7,
    recommendation: "Schedule 1:1 meeting to discuss and offer flexible start time"
  },
  {
    id: "2",
    employeeId: "emp002", 
    employeeName: "Sarah Chen",
    department: "Sales",
    type: "Extended Break",
    severity: "Low",
    description: "Lunch breaks extended by 15-20 minutes over the past 3 days",
    detectedAt: "2024-02-20 13:45",
    impact: "Minor impact on afternoon productivity",
    pattern: "Recent trend, started this week",
    frequency: 3,
    recommendation: "Gentle reminder about break policies"
  },
  {
    id: "3",
    employeeId: "emp003",
    employeeName: "Michael Rodriguez",
    department: "Marketing",
    type: "Absence Pattern", 
    severity: "High",
    description: "Frequent Monday absences detected (4 out of last 6 Mondays)",
    detectedAt: "2024-02-19 10:00",
    impact: "Weekly planning meetings affected",
    pattern: "Monday absence pattern",
    frequency: 4,
    recommendation: "HR intervention required, investigate underlying issues"
  },
  {
    id: "4",
    employeeId: "emp004",
    employeeName: "Emma Wilson",
    department: "Engineering",
    type: "Weekend Activity",
    severity: "Critical", 
    description: "Excessive weekend work hours detected (25+ hours last weekend)",
    detectedAt: "2024-02-18 22:30",
    impact: "Risk of burnout and decreased weekday performance",
    pattern: "Increasing weekend work trend",
    frequency: 3,
    recommendation: "Immediate manager intervention, workload assessment required"
  }
];

const employees: Employee[] = [
  {
    id: "emp001",
    name: "Alex Thompson",
    department: "Engineering",
    role: "Senior Developer",
    attendanceScore: 78,
    punctualityRate: 65,
    absenceRate: 8.2,
    avgHoursPerWeek: 42.5,
    recentAnomalies: 2,
    trend: "declining"
  },
  {
    id: "emp002",
    name: "Sarah Chen", 
    department: "Sales",
    role: "Account Manager",
    attendanceScore: 92,
    punctualityRate: 96,
    absenceRate: 3.1,
    avgHoursPerWeek: 44.2,
    recentAnomalies: 1,
    trend: "stable"
  },
  {
    id: "emp003",
    name: "Michael Rodriguez",
    department: "Marketing",
    role: "Marketing Specialist",
    attendanceScore: 71,
    punctualityRate: 82,
    absenceRate: 12.5,
    avgHoursPerWeek: 38.8,
    recentAnomalies: 3,
    trend: "declining"
  },
  {
    id: "emp004",
    name: "Emma Wilson",
    department: "Engineering", 
    role: "Frontend Developer",
    attendanceScore: 85,
    punctualityRate: 94,
    absenceRate: 4.2,
    avgHoursPerWeek: 48.7,
    recentAnomalies: 1,
    trend: "improving"
  }
];

const departmentMetrics: AttendanceMetrics[] = [
  {
    department: "Engineering",
    totalEmployees: 45,
    presentToday: 42,
    onTimeRate: 87.3,
    avgWorkHours: 43.2,
    absenceRate: 6.8,
    anomaliesDetected: 8
  },
  {
    department: "Sales",
    totalEmployees: 32,
    presentToday: 30,
    onTimeRate: 91.5,
    avgWorkHours: 41.8,
    absenceRate: 4.2,
    anomaliesDetected: 3
  },
  {
    department: "Marketing",
    totalEmployees: 18,
    presentToday: 16,
    onTimeRate: 84.7,
    avgWorkHours: 40.5,
    absenceRate: 8.9,
    anomaliesDetected: 5
  },
  {
    department: "HR",
    totalEmployees: 12,
    presentToday: 12,
    onTimeRate: 95.2,
    avgWorkHours: 40.0,
    absenceRate: 2.1,
    anomaliesDetected: 1
  }
];

export default function AttendanceDetector() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-600 border-red-200";
      case "High": return "bg-orange-100 text-orange-600 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "Low": return "bg-green-100 text-green-600 border-green-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Late Arrival": return <Clock className="h-4 w-4" />;
      case "Early Departure": return <Timer className="h-4 w-4" />;
      case "Extended Break": return <Activity className="h-4 w-4" />;
      case "Absence Pattern": return <Calendar className="h-4 w-4" />;
      case "Weekend Activity": return <Zap className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAttendanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const totalAnomalies = attendanceAnomalies.length;
  const criticalAnomalies = attendanceAnomalies.filter(a => a.severity === "Critical").length;
  const avgAttendanceScore = employees.reduce((sum, emp) => sum + emp.attendanceScore, 0) / employees.length;
  const totalPresent = departmentMetrics.reduce((sum, dept) => sum + dept.presentToday, 0);
  const totalEmployees = departmentMetrics.reduce((sum, dept) => sum + dept.totalEmployees, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-pink-500 rounded-lg">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Attendance Anomaly Detector</h1>
          <p className="text-muted-foreground">AI-powered detection of attendance patterns and potential issues</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{criticalAnomalies}</p>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{totalAnomalies}</p>
                <p className="text-sm text-muted-foreground">Total Anomalies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalPresent}/{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Present Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(avgAttendanceScore)}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="anomalies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="anomalies">Current Anomalies</TabsTrigger>
          <TabsTrigger value="employees">Employee Analytics</TabsTrigger>
          <TabsTrigger value="departments">Department Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="search">Search Employees</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timeframe</Label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly List */}
          <div className="space-y-4">
            {attendanceAnomalies.map((anomaly) => (
              <Card key={anomaly.id} className={`border-l-4 ${getSeverityColor(anomaly.severity).includes('red') ? 'border-l-red-500' : 
                getSeverityColor(anomaly.severity).includes('orange') ? 'border-l-orange-500' :
                getSeverityColor(anomaly.severity).includes('yellow') ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(anomaly.type)}
                        <h3 className="font-semibold">{anomaly.employeeName}</h3>
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity}
                        </Badge>
                        <Badge variant="outline">{anomaly.type}</Badge>
                        <Badge variant="secondary">{anomaly.department}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{anomaly.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="font-medium">Detected:</span> {anomaly.detectedAt}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Pattern:</span> {anomaly.pattern}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Frequency:</span> {anomaly.frequency} times
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm"><strong>Impact:</strong> {anomaly.impact}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm"><strong>AI Recommendation:</strong> {anomaly.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Button size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Notify Manager
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Resolved
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Attendance Analytics
              </CardTitle>
              <CardDescription>
                Individual attendance performance and anomaly tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{employee.name}</h4>
                          <Badge variant="outline">{employee.department}</Badge>
                          <Badge variant="secondary">{employee.role}</Badge>
                          {getTrendIcon(employee.trend)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <div className={`text-lg font-semibold ${getAttendanceColor(employee.attendanceScore)}`}>
                              {employee.attendanceScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Attendance Score</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <div className="text-lg font-semibold">{employee.punctualityRate}%</div>
                            <div className="text-xs text-muted-foreground">Punctuality</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <div className="text-lg font-semibold">{employee.absenceRate}%</div>
                            <div className="text-xs text-muted-foreground">Absence Rate</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <div className="text-lg font-semibold">{employee.avgHoursPerWeek}h</div>
                            <div className="text-xs text-muted-foreground">Avg Hours/Week</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded">
                            <div className="text-lg font-semibold text-red-600">{employee.recentAnomalies}</div>
                            <div className="text-xs text-muted-foreground">Recent Anomalies</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Performance</span>
                            <span className={getAttendanceColor(employee.attendanceScore)}>
                              {employee.attendanceScore}/100
                            </span>
                          </div>
                          <Progress value={employee.attendanceScore} className="h-2" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[100px]">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View History
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="h-3 w-3 mr-1" />
                          Set Alert
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Department Attendance Overview
              </CardTitle>
              <CardDescription>
                Attendance metrics and anomaly counts by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentMetrics.map((dept) => (
                  <div key={dept.department} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{dept.department}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={dept.anomaliesDetected > 5 ? "destructive" : "secondary"}>
                          {dept.anomaliesDetected} anomalies
                        </Badge>
                        <Badge variant="outline">
                          {dept.presentToday}/{dept.totalEmployees} present
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-semibold text-green-600">
                          {((dept.presentToday / dept.totalEmployees) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Present Today</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-semibold text-blue-600">{dept.onTimeRate}%</div>
                        <div className="text-xs text-muted-foreground">On-Time Rate</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-semibold text-yellow-600">{dept.avgWorkHours}h</div>
                        <div className="text-xs text-muted-foreground">Avg Work Hours</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-lg font-semibold text-orange-600">{dept.absenceRate}%</div>
                        <div className="text-xs text-muted-foreground">Absence Rate</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <div className="text-lg font-semibold text-red-600">{dept.anomaliesDetected}</div>
                        <div className="text-xs text-muted-foreground">Anomalies</div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Department Health Score</span>
                        <span className={getAttendanceColor(dept.onTimeRate)}>
                          {Math.round((dept.onTimeRate + (100 - dept.absenceRate)) / 2)}%
                        </span>
                      </div>
                      <Progress value={(dept.onTimeRate + (100 - dept.absenceRate)) / 2} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">87.3%</div>
                    <div className="text-sm text-muted-foreground">Average This Week</div>
                  </div>
                  <div className="space-y-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => {
                      const rates = [89, 91, 86, 88, 83];
                      return (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm">{day}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={rates[index]} className="w-20 h-2" />
                            <span className="text-sm font-medium w-12">{rates[index]}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "Late Arrival", count: 12, color: "bg-red-500" },
                    { type: "Extended Break", count: 8, color: "bg-orange-500" },
                    { type: "Absence Pattern", count: 6, color: "bg-yellow-500" },
                    { type: "Early Departure", count: 4, color: "bg-blue-500" },
                    { type: "Weekend Activity", count: 3, color: "bg-purple-500" }
                  ].map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(item.count / 33) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Pattern Recognition Insights</CardTitle>
              <CardDescription>
                Machine learning insights from attendance data analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-3">Detected Patterns</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-300">
                      <p className="text-sm font-medium">Monday Absence Spike</p>
                      <p className="text-xs text-muted-foreground">
                        15% higher absence rate on Mondays, especially after long weekends
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-300">
                      <p className="text-sm font-medium">Post-Lunch Tardiness</p>
                      <p className="text-xs text-muted-foreground">
                        Late returns from lunch increase by 23% during summer months
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-300">
                      <p className="text-sm font-medium">Remote Work Correlation</p>
                      <p className="text-xs text-muted-foreground">
                        Higher punctuality on days following remote work days
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Predictions & Recommendations</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border-l-2 border-green-300">
                      <p className="text-sm font-medium">Implement Flexible Mondays</p>
                      <p className="text-xs text-muted-foreground">
                        Could reduce Monday absences by an estimated 40%
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-2 border-green-300">
                      <p className="text-sm font-medium">Extend Lunch Windows</p>
                      <p className="text-xs text-muted-foreground">
                        Flexible lunch times could improve afternoon punctuality
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-2 border-green-300">
                      <p className="text-sm font-medium">Early Warning System</p>
                      <p className="text-xs text-muted-foreground">
                        Can predict potential issues 5-7 days in advance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Configuration
              </CardTitle>
              <CardDescription>
                Configure automatic alerts for attendance anomalies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Threshold Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="late-threshold">Late Arrival Threshold (minutes)</Label>
                      <Input id="late-threshold" type="number" defaultValue="15" />
                    </div>
                    <div>
                      <Label htmlFor="absence-threshold">Absence Pattern Alert (occurrences)</Label>
                      <Input id="absence-threshold" type="number" defaultValue="3" />
                    </div>
                    <div>
                      <Label htmlFor="overtime-threshold">Excessive Hours Alert (hours/week)</Label>
                      <Input id="overtime-threshold" type="number" defaultValue="50" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Notification Settings</h4>
                  <div className="space-y-3">
                    {[
                      "Email notifications to managers",
                      "Slack alerts for critical anomalies", 
                      "Weekly attendance reports",
                      "Real-time dashboard updates",
                      "Mobile push notifications"
                    ].map((setting, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="rounded border border-input" 
                          defaultChecked={index < 3} 
                        />
                        <span className="text-sm">{setting}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Active Alert Rules</h4>
                <div className="space-y-3">
                  {[
                    { 
                      rule: "Critical Overtime Alert", 
                      condition: "More than 60 hours/week", 
                      action: "Immediate manager notification",
                      status: "Active"
                    },
                    { 
                      rule: "Frequent Late Arrival", 
                      condition: "Late 3+ times in a week", 
                      action: "HR notification",
                      status: "Active"
                    },
                    { 
                      rule: "Absence Pattern Detection", 
                      condition: "Same weekday absence 3+ times", 
                      action: "Manager alert",
                      status: "Active"
                    },
                    { 
                      rule: "Department Attendance Drop", 
                      condition: "Below 85% department attendance", 
                      action: "Department head notification",
                      status: "Paused"
                    }
                  ].map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium">{rule.rule}</h5>
                        <div className="text-sm text-muted-foreground">
                          <span>{rule.condition} → {rule.action}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={rule.status === "Active" ? "default" : "secondary"}>
                          {rule.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button>
                  Save Settings
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
