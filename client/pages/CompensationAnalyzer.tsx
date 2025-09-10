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
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Users,
  BarChart3,
  Target,
  Scale,
  Award,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Lightbulb,
  Building,
  MapPin,
  Calendar,
  Search
} from "lucide-react";

interface CompensationData {
  role: string;
  department: string;
  level: string;
  employees: number;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  marketRate: number;
  genderPayGap: number;
  diversityIndex: number;
  complianceScore: number;
}

interface PayEquityAlert {
  id: string;
  type: "Gender Gap" | "Experience Gap" | "Market Gap" | "Diversity Gap";
  severity: "High" | "Medium" | "Low";
  department: string;
  role: string;
  description: string;
  impact: number;
  recommendation: string;
}

interface MarketBenchmark {
  role: string;
  internalAvg: number;
  marketP25: number;
  marketP50: number;
  marketP75: number;
  marketP90: number;
  competitiveness: "Below Market" | "At Market" | "Above Market";
}

const compensationData: CompensationData[] = [
  {
    role: "Software Engineer",
    department: "Engineering",
    level: "Senior",
    employees: 12,
    avgSalary: 125000,
    minSalary: 115000,
    maxSalary: 140000,
    marketRate: 128000,
    genderPayGap: 3.2,
    diversityIndex: 78,
    complianceScore: 87
  },
  {
    role: "Product Manager",
    department: "Product",
    level: "Senior",
    employees: 6,
    avgSalary: 135000,
    minSalary: 125000,
    maxSalary: 145000,
    marketRate: 132000,
    genderPayGap: 1.8,
    diversityIndex: 82,
    complianceScore: 92
  },
  {
    role: "Sales Representative",
    department: "Sales", 
    level: "Mid",
    employees: 18,
    avgSalary: 75000,
    minSalary: 65000,
    maxSalary: 85000,
    marketRate: 78000,
    genderPayGap: 8.5,
    diversityIndex: 65,
    complianceScore: 74
  },
  {
    role: "Marketing Manager",
    department: "Marketing",
    level: "Senior",
    employees: 8,
    avgSalary: 98000,
    minSalary: 88000,
    maxSalary: 110000,
    marketRate: 102000,
    genderPayGap: 2.1,
    diversityIndex: 88,
    complianceScore: 89
  }
];

const payEquityAlerts: PayEquityAlert[] = [
  {
    id: "1",
    type: "Gender Gap",
    severity: "High",
    department: "Sales",
    role: "Sales Representative",
    description: "8.5% gender pay gap identified in Sales Representative role",
    impact: 8.5,
    recommendation: "Conduct detailed compensation review and adjust salaries to reduce gap to <3%"
  },
  {
    id: "2",
    type: "Market Gap",
    severity: "Medium", 
    department: "Sales",
    role: "Sales Representative",
    description: "Average salary 3.8% below market rate",
    impact: 3.8,
    recommendation: "Consider market adjustment to maintain competitiveness"
  },
  {
    id: "3",
    type: "Experience Gap",
    severity: "Medium",
    department: "Engineering", 
    role: "Software Engineer",
    description: "Pay disparity between similar experience levels detected",
    impact: 5.2,
    recommendation: "Review experience-based compensation bands and standardize"
  }
];

const marketBenchmarks: MarketBenchmark[] = [
  {
    role: "Software Engineer (Senior)",
    internalAvg: 125000,
    marketP25: 115000,
    marketP50: 128000,
    marketP75: 142000,
    marketP90: 158000,
    competitiveness: "At Market"
  },
  {
    role: "Product Manager (Senior)",
    internalAvg: 135000,
    marketP25: 125000,
    marketP50: 132000,
    marketP75: 148000,
    marketP90: 165000,
    competitiveness: "Above Market"
  },
  {
    role: "Sales Representative (Mid)",
    internalAvg: 75000,
    marketP25: 68000,
    marketP50: 78000,
    marketP75: 86000,
    marketP90: 95000,
    competitiveness: "Below Market"
  }
];

export default function CompensationAnalyzer() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [analysisType, setAnalysisType] = useState("pay-equity");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-600";
      case "Medium": return "bg-yellow-100 text-yellow-600";
      case "Low": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getCompetitivenessColor = (competitiveness: string) => {
    switch (competitiveness) {
      case "Above Market": return "text-green-600";
      case "At Market": return "text-blue-600";
      case "Below Market": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const overallPayGap = compensationData.reduce((sum, item) => sum + item.genderPayGap, 0) / compensationData.length;
  const avgComplianceScore = compensationData.reduce((sum, item) => sum + item.complianceScore, 0) / compensationData.length;
  const totalEmployees = compensationData.reduce((sum, item) => sum + item.employees, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-lg">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Compensation Fairness Analyzer</h1>
          <p className="text-muted-foreground">Ensure fair and competitive compensation across your organization</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{overallPayGap.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Pay Gap</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(avgComplianceScore)}</p>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{payEquityAlerts.filter(a => a.severity === "High").length}</p>
                <p className="text-sm text-muted-foreground">High Priority Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Employees Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pay-equity">Pay Equity</TabsTrigger>
          <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Analysis Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <SelectItem value="Product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Level</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Analysis Type</Label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pay-equity">Pay Equity</SelectItem>
                      <SelectItem value="market-comp">Market Comparison</SelectItem>
                      <SelectItem value="salary-bands">Salary Bands</SelectItem>
                      <SelectItem value="diversity">Diversity Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Compensation Overview by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compensationData.map((data, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{data.role}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{data.department}</span>
                          <span>{data.level} Level</span>
                          <span>{data.employees} employees</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(data.avgSalary)}</div>
                        <div className="text-sm text-muted-foreground">Average Salary</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-lg font-semibold">{formatCurrency(data.minSalary)}</div>
                        <div className="text-xs text-muted-foreground">Minimum</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-lg font-semibold">{formatCurrency(data.maxSalary)}</div>
                        <div className="text-xs text-muted-foreground">Maximum</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-lg font-semibold">{data.genderPayGap.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Pay Gap</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className={`text-lg font-semibold ${getComplianceColor(data.complianceScore)}`}>
                          {data.complianceScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Compliance</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pay-equity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Pay Equity Alerts
              </CardTitle>
              <CardDescription>
                Identified disparities requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payEquityAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.type}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{alert.impact.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Impact</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">{alert.department} - {alert.role}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm"><strong>Recommendation:</strong> {alert.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pay Gap Analysis by Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Gender Pay Gap by Department</h4>
                  <div className="space-y-3">
                    {compensationData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.department}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={data.genderPayGap * 5} className="w-20 h-2" />
                          <span className="text-sm font-medium w-12">{data.genderPayGap.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Diversity Index by Role</h4>
                  <div className="space-y-3">
                    {compensationData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.role}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={data.diversityIndex} className="w-20 h-2" />
                          <span className="text-sm font-medium w-12">{data.diversityIndex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Benchmarking Analysis
              </CardTitle>
              <CardDescription>
                Compare internal compensation with market rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketBenchmarks.map((benchmark, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{benchmark.role}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCompetitivenessColor(benchmark.competitiveness)}>
                            {benchmark.competitiveness}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(benchmark.internalAvg)}</div>
                        <div className="text-sm text-muted-foreground">Internal Average</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Market Range</span>
                        <span>25th - 90th Percentile</span>
                      </div>
                      <div className="relative">
                        <div className="h-4 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full"></div>
                        <div 
                          className="absolute top-0 w-1 h-4 bg-blue-600 rounded-full"
                          style={{ 
                            left: `${((benchmark.internalAvg - benchmark.marketP25) / (benchmark.marketP90 - benchmark.marketP25)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>{formatCurrency(benchmark.marketP25)}</span>
                        <span>{formatCurrency(benchmark.marketP50)}</span>
                        <span>{formatCurrency(benchmark.marketP75)}</span>
                        <span>{formatCurrency(benchmark.marketP90)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>
                Strategic actions to improve compensation fairness and competitiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Immediate Actions Required
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg border-l-2 border-red-300">
                        <p className="text-sm font-medium">Address Sales Representative Pay Gap</p>
                        <p className="text-xs text-muted-foreground mt-1">8.5% gender pay gap needs immediate correction</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border-l-2 border-red-300">
                        <p className="text-sm font-medium">Market Rate Adjustment</p>
                        <p className="text-xs text-muted-foreground mt-1">Sales team compensation 3.8% below market</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Strategic Improvements
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg border-l-2 border-yellow-300">
                        <p className="text-sm font-medium">Standardize Experience Bands</p>
                        <p className="text-xs text-muted-foreground mt-1">Create clear compensation tiers by experience level</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border-l-2 border-yellow-300">
                        <p className="text-sm font-medium">Implement Regular Market Reviews</p>
                        <p className="text-xs text-muted-foreground mt-1">Quarterly market rate analysis and adjustments</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4">Detailed Action Plan</h4>
                  <div className="space-y-4">
                    {[
                      {
                        priority: "High",
                        action: "Conduct salary audit for Sales Representative role",
                        timeline: "Within 30 days", 
                        cost: "$15,000 - $25,000",
                        impact: "Eliminate 8.5% gender pay gap"
                      },
                      {
                        priority: "High",
                        action: "Market rate adjustment for underperforming roles",
                        timeline: "Next quarter",
                        cost: "$50,000 - $75,000",
                        impact: "Improve competitiveness and retention"
                      },
                      {
                        priority: "Medium",
                        action: "Develop transparent salary band framework",
                        timeline: "90 days",
                        cost: "$10,000 - $15,000",
                        impact: "Standardize compensation practices"
                      },
                      {
                        priority: "Medium",
                        action: "Implement automated pay equity monitoring",
                        timeline: "6 months",
                        cost: "$25,000 - $40,000",
                        impact: "Proactive identification of disparities"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <Badge className={
                          item.priority === "High" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                        }>
                          {item.priority}
                        </Badge>
                        <div className="flex-1">
                          <h5 className="font-medium">{item.action}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                            <span>Timeline: {item.timeline}</span>
                            <span>Cost: {item.cost}</span>
                            <span>Impact: {item.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Compliance Dashboard
              </CardTitle>
              <CardDescription>
                Track compliance with pay equity regulations and company policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
                  <div className="text-sm font-medium">Overall Compliance</div>
                  <div className="text-xs text-muted-foreground">Company-wide score</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                  <div className="text-sm font-medium">Audit Findings</div>
                  <div className="text-xs text-muted-foreground">Requiring action</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">Q1</div>
                  <div className="text-sm font-medium">Next Review</div>
                  <div className="text-xs text-muted-foreground">2024 Compliance Audit</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Compliance Checklist</h4>
                {[
                  { item: "Equal Pay Act Compliance", status: "Compliant", score: 95 },
                  { item: "Pay Transparency Requirements", status: "Needs Attention", score: 78 },
                  { item: "Salary Band Documentation", status: "Compliant", score: 92 },
                  { item: "Pay Equity Monitoring", status: "Compliant", score: 88 },
                  { item: "Market Rate Justification", status: "Needs Attention", score: 74 }
                ].map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        check.status === "Compliant" ? "bg-green-500" : "bg-yellow-500"
                      }`}></div>
                      <span className="font-medium">{check.item}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={check.status === "Compliant" ? "default" : "secondary"}>
                        {check.status}
                      </Badge>
                      <span className={`font-semibold ${getComplianceColor(check.score)}`}>
                        {check.score}%
                      </span>
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
