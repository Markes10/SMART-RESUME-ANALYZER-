import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Shield, 
  Target,
  Brain,
  Search,
  Filter,
  Download,
  Mail,
  Calendar,
  DollarSign
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  tenure: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  lastReview: string;
  satisfactionScore: number;
  factors: string[];
}

interface DepartmentMetrics {
  department: string;
  totalEmployees: number;
  turnoverRate: number;
  avgTenure: string;
  satisfactionScore: number;
  atRiskEmployees: number;
}

const mockEmployees: Employee[] = [
  {
    id: "001",
    name: "Sarah Johnson",
    department: "Engineering",
    role: "Senior Developer",
    tenure: "2.5 years",
    riskScore: 87,
    riskLevel: "Critical",
    lastReview: "2024-01-15",
    satisfactionScore: 6.2,
    factors: ["Low satisfaction", "Overworked", "Limited growth"]
  },
  {
    id: "002", 
    name: "Michael Chen",
    department: "Marketing",
    role: "Marketing Manager",
    tenure: "1.8 years",
    riskScore: 72,
    riskLevel: "High",
    lastReview: "2024-01-20",
    satisfactionScore: 7.1,
    factors: ["Career plateau", "Work-life balance"]
  },
  {
    id: "003",
    name: "Emily Rodriguez", 
    department: "Sales",
    role: "Sales Representative",
    tenure: "3.2 years",
    riskScore: 45,
    riskLevel: "Medium",
    lastReview: "2024-01-18",
    satisfactionScore: 7.8,
    factors: ["Compensation concerns"]
  },
  {
    id: "004",
    name: "David Park",
    department: "Engineering", 
    role: "Frontend Developer",
    tenure: "4.1 years",
    riskScore: 23,
    riskLevel: "Low",
    lastReview: "2024-01-22",
    satisfactionScore: 8.4,
    factors: []
  },
  {
    id: "005",
    name: "Lisa Thompson",
    department: "HR",
    role: "HR Specialist",
    tenure: "5.3 years",
    riskScore: 91,
    riskLevel: "Critical",
    lastReview: "2024-01-10",
    satisfactionScore: 5.8,
    factors: ["Burnout", "Role mismatch", "Management issues"]
  }
];

const departmentMetrics: DepartmentMetrics[] = [
  {
    department: "Engineering",
    totalEmployees: 45,
    turnoverRate: 18.2,
    avgTenure: "2.8 years",
    satisfactionScore: 7.2,
    atRiskEmployees: 8
  },
  {
    department: "Sales", 
    totalEmployees: 32,
    turnoverRate: 22.5,
    avgTenure: "1.9 years", 
    satisfactionScore: 7.6,
    atRiskEmployees: 6
  },
  {
    department: "Marketing",
    totalEmployees: 18,
    turnoverRate: 15.8,
    avgTenure: "3.1 years",
    satisfactionScore: 7.9,
    atRiskEmployees: 3
  },
  {
    department: "HR",
    totalEmployees: 12,
    turnoverRate: 25.0,
    avgTenure: "2.2 years",
    satisfactionScore: 6.8,
    atRiskEmployees: 4
  }
];

const retentionStrategies = [
  {
    category: "Compensation & Benefits",
    strategies: [
      "Conduct salary benchmarking analysis",
      "Implement performance-based bonuses",
      "Enhance benefits package",
      "Offer equity/stock options"
    ]
  },
  {
    category: "Career Development", 
    strategies: [
      "Create clear career progression paths",
      "Implement mentorship programs",
      "Provide learning & development opportunities",
      "Cross-functional project assignments"
    ]
  },
  {
    category: "Work Environment",
    strategies: [
      "Improve work-life balance policies",
      "Flexible work arrangements",
      "Team building activities",
      "Recognition programs"
    ]
  },
  {
    category: "Management & Leadership",
    strategies: [
      "Manager training programs",
      "Regular 1-on-1 meetings",
      "360-degree feedback",
      "Leadership development"
    ]
  }
];

export default function TurnoverRetention() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Critical": return "text-red-600 bg-red-100";
      case "High": return "text-orange-600 bg-orange-100"; 
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-orange-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesDepartment = selectedDepartment === "all" || emp.department === selectedDepartment;
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "all" || emp.riskLevel === riskFilter;
    return matchesDepartment && matchesSearch && matchesRisk;
  });

  const criticalEmployees = mockEmployees.filter(emp => emp.riskLevel === "Critical").length;
  const highRiskEmployees = mockEmployees.filter(emp => emp.riskLevel === "High").length;
  const avgSatisfaction = mockEmployees.reduce((sum, emp) => sum + emp.satisfactionScore, 0) / mockEmployees.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg">
          <TrendingDown className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Predictive Turnover & Retention Bot</h1>
          <p className="text-muted-foreground">AI-powered analytics to predict and prevent employee turnover</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{criticalEmployees}</p>
                <p className="text-sm text-muted-foreground">Critical Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{highRiskEmployees}</p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockEmployees.length}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">At-Risk Employees</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="strategies">Retention Strategies</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Employees</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or role..."
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
                  <Label>Risk Level</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee List */}
          <div className="grid gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{employee.name}</h3>
                        <Badge className={getRiskColor(employee.riskLevel)}>
                          {employee.riskLevel} Risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Role:</span> {employee.role}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {employee.department}
                        </div>
                        <div>
                          <span className="font-medium">Tenure:</span> {employee.tenure}
                        </div>
                        <div>
                          <span className="font-medium">Satisfaction:</span> {employee.satisfactionScore}/10
                        </div>
                      </div>
                      {employee.factors.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-muted-foreground">Risk Factors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {employee.factors.map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-3 min-w-[120px]">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{employee.riskScore}%</div>
                        <div className="text-xs text-muted-foreground">Risk Score</div>
                      </div>
                      <Progress 
                        value={employee.riskScore} 
                        className={`w-full h-2 ${getProgressColor(employee.riskScore)}`}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-4">
            {departmentMetrics.map((dept) => (
              <Card key={dept.department}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {dept.department}
                    <Badge variant={dept.turnoverRate > 20 ? "destructive" : "secondary"}>
                      {dept.turnoverRate}% Turnover
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{dept.totalEmployees}</div>
                      <div className="text-sm text-muted-foreground">Total Employees</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{dept.avgTenure}</div>
                      <div className="text-sm text-muted-foreground">Avg Tenure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{dept.satisfactionScore}</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{dept.atRiskEmployees}</div>
                      <div className="text-sm text-muted-foreground">At Risk</div>
                    </div>
                    <div className="text-center">
                      <Progress value={dept.turnoverRate} className="mt-2" />
                      <div className="text-sm text-muted-foreground mt-1">Turnover Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {retentionStrategies.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.strategies.map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Predictions & Insights
              </CardTitle>
              <CardDescription>
                Machine learning predictions based on historical data and current patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">23%</div>
                  <div className="text-sm font-medium">Predicted Turnover</div>
                  <div className="text-xs text-muted-foreground">Next 12 months</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$890K</div>
                  <div className="text-sm font-medium">Potential Cost Savings</div>
                  <div className="text-xs text-muted-foreground">With interventions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                  <div className="text-sm font-medium">Retention Success</div>
                  <div className="text-xs text-muted-foreground">With AI recommendations</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Key AI Insights:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-medium">1</span>
                    </div>
                    <p className="text-sm">Employees with satisfaction scores below 7.0 are 3.2x more likely to leave within 6 months.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-medium">2</span>
                    </div>
                    <p className="text-sm">Engineering department shows highest turnover risk due to market competition and limited growth paths.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-medium">3</span>
                    </div>
                    <p className="text-sm">Implementing flexible work arrangements could reduce turnover by an estimated 15-20%.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-medium">4</span>
                    </div>
                    <p className="text-sm">Early intervention with at-risk employees has shown 78% success rate in retention.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
