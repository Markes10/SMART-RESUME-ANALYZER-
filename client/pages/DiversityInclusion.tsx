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
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Lightbulb,
  Scale,
  Heart,
  Globe,
  Zap,
  Building,
  GraduationCap
} from "lucide-react";

interface DiversityMetric {
  category: string;
  demographic: string;
  current: number;
  target: number;
  industry: number;
  trend: number;
  representation: string;
}

interface InclusionScore {
  department: string;
  overallScore: number;
  belonging: number;
  fairness: number;
  respect: number;
  voice: number;
  growth: number;
  responseRate: number;
}

interface HiringData {
  month: string;
  totalHires: number;
  diverseHires: number;
  percentage: number;
  target: number;
}

interface PromotionData {
  level: string;
  totalPromotions: number;
  diversePromotions: number;
  percentage: number;
  equityGap: number;
}

interface PayEquityData {
  demographic: string;
  avgSalary: number;
  payGap: number;
  medianGap: number;
  adjustedGap: number;
}

const diversityMetrics: DiversityMetric[] = [
  {
    category: "Gender",
    demographic: "Women",
    current: 42,
    target: 50,
    industry: 38,
    trend: 3.2,
    representation: "Leadership"
  },
  {
    category: "Gender",
    demographic: "Non-binary",
    current: 2,
    target: 3,
    industry: 1.5,
    trend: 0.8,
    representation: "Overall"
  },
  {
    category: "Ethnicity",
    demographic: "Hispanic/Latino",
    current: 18,
    target: 22,
    industry: 16,
    trend: 2.1,
    representation: "Technical"
  },
  {
    category: "Ethnicity",
    demographic: "Black/African American",
    current: 14,
    target: 18,
    industry: 12,
    trend: 1.5,
    representation: "Technical"
  },
  {
    category: "Ethnicity",
    demographic: "Asian",
    current: 28,
    target: 25,
    industry: 30,
    trend: -1.2,
    representation: "Leadership"
  },
  {
    category: "Age",
    demographic: "Gen Z",
    current: 22,
    target: 25,
    industry: 18,
    trend: 4.5,
    representation: "Entry Level"
  }
];

const inclusionScores: InclusionScore[] = [
  {
    department: "Engineering",
    overallScore: 78,
    belonging: 76,
    fairness: 82,
    respect: 85,
    voice: 74,
    growth: 79,
    responseRate: 89
  },
  {
    department: "Sales",
    overallScore: 85,
    belonging: 88,
    fairness: 84,
    respect: 87,
    voice: 83,
    growth: 85,
    responseRate: 92
  },
  {
    department: "Marketing",
    overallScore: 82,
    belonging: 85,
    fairness: 81,
    respect: 84,
    voice: 79,
    growth: 82,
    responseRate: 95
  },
  {
    department: "Product",
    overallScore: 75,
    belonging: 73,
    fairness: 78,
    respect: 80,
    voice: 71,
    growth: 75,
    responseRate: 87
  }
];

const hiringData: HiringData[] = [
  { month: "Jan", totalHires: 12, diverseHires: 7, percentage: 58, target: 50 },
  { month: "Feb", totalHires: 8, diverseHires: 4, percentage: 50, target: 50 },
  { month: "Mar", totalHires: 15, diverseHires: 9, percentage: 60, target: 50 },
  { month: "Apr", totalHires: 10, diverseHires: 6, percentage: 60, target: 50 },
  { month: "May", totalHires: 18, diverseHires: 11, percentage: 61, target: 50 },
  { month: "Jun", totalHires: 14, diverseHires: 8, percentage: 57, target: 50 }
];

const promotionData: PromotionData[] = [
  { level: "Junior → Mid", totalPromotions: 25, diversePromotions: 14, percentage: 56, equityGap: 6 },
  { level: "Mid → Senior", totalPromotions: 18, diversePromotions: 8, percentage: 44, equityGap: -6 },
  { level: "Senior → Staff", totalPromotions: 12, diversePromotions: 4, percentage: 33, equityGap: -17 },
  { level: "Staff → Principal", totalPromotions: 6, diversePromotions: 1, percentage: 17, equityGap: -33 }
];

const payEquityData: PayEquityData[] = [
  { demographic: "Women", avgSalary: 98500, payGap: 3.2, medianGap: 2.8, adjustedGap: 1.1 },
  { demographic: "Hispanic/Latino", avgSalary: 96800, payGap: 4.8, medianGap: 4.2, adjustedGap: 2.3 },
  { demographic: "Black/African American", avgSalary: 95200, payGap: 6.5, medianGap: 5.9, adjustedGap: 3.1 },
  { demographic: "LGBTQ+", avgSalary: 99200, payGap: 2.1, medianGap: 1.8, adjustedGap: 0.9 }
];

export default function DiversityInclusion() {
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("year");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGapColor = (gap: number) => {
    if (Math.abs(gap) <= 2) return "text-green-600";
    if (Math.abs(gap) <= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const overallDiversityScore = diversityMetrics.reduce((sum, metric) => 
    sum + (metric.current / metric.target) * 100, 0) / diversityMetrics.length;
  const avgInclusionScore = inclusionScores.reduce((sum, score) => sum + score.overallScore, 0) / inclusionScores.length;
  const totalHires = hiringData.reduce((sum, data) => sum + data.totalHires, 0);
  const totalDiverseHires = hiringData.reduce((sum, data) => sum + data.diverseHires, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-cyan-500 rounded-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Diversity & Inclusion Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights to promote diversity and inclusion across your organization</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(overallDiversityScore)}%</p>
                <p className="text-sm text-muted-foreground">Diversity Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(avgInclusionScore)}</p>
                <p className="text-sm text-muted-foreground">Inclusion Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round((totalDiverseHires / totalHires) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Diverse Hiring</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">2.4%</p>
                <p className="text-sm text-muted-foreground">Avg Pay Gap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="representation">Representation</TabsTrigger>
          <TabsTrigger value="inclusion">Inclusion Survey</TabsTrigger>
          <TabsTrigger value="hiring">Hiring & Promotion</TabsTrigger>
          <TabsTrigger value="pay-equity">Pay Equity</TabsTrigger>
          <TabsTrigger value="goals">Goals & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Analytics Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Metric Type</Label>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Metrics</SelectItem>
                      <SelectItem value="gender">Gender</SelectItem>
                      <SelectItem value="ethnicity">Ethnicity</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="disability">Disability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
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
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="5years">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Diversity Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round(overallDiversityScore)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Progress to Goals</div>
                  </div>
                  <Progress value={overallDiversityScore} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-green-600">6</div>
                      <div className="text-muted-foreground">Goals Met</div>
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-600">4</div>
                      <div className="text-muted-foreground">In Progress</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600">2</div>
                      <div className="text-muted-foreground">Behind Target</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Inclusion Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {Math.round(avgInclusionScore)}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Inclusion Score</div>
                  </div>
                  <div className="space-y-2">
                    {["Belonging", "Fairness", "Respect", "Voice", "Growth"].map((category, index) => {
                      const scores = [80, 81, 84, 77, 80];
                      return (
                        <div key={category} className="flex justify-between text-sm">
                          <span>{category}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={scores[index]} className="w-16 h-2" />
                            <span className="w-8">{scores[index]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Machine learning analysis of diversity and inclusion trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Positive Trends
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border-l-2 border-green-300">
                      <p className="text-sm font-medium">Inclusive Leadership Growth</p>
                      <p className="text-xs text-muted-foreground">
                        Leadership diversity increased by 15% this year, ahead of 10% target
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-2 border-green-300">
                      <p className="text-sm font-medium">Gen Z Engagement High</p>
                      <p className="text-xs text-muted-foreground">
                        Young professionals report 22% higher inclusion scores than average
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Areas for Focus
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border-l-2 border-orange-300">
                      <p className="text-sm font-medium">Senior Level Representation</p>
                      <p className="text-xs text-muted-foreground">
                        Diversity decreases significantly at senior levels, requiring targeted action
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border-l-2 border-orange-300">
                      <p className="text-sm font-medium">Engineering Voice Scores</p>
                      <p className="text-xs text-muted-foreground">
                        Engineering team reports lower "voice" scores, indicating need for psychological safety
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="representation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Workforce Representation
              </CardTitle>
              <CardDescription>
                Track representation across different demographic dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {diversityMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{metric.demographic}</h4>
                        <Badge variant="outline">{metric.category}</Badge>
                        <Badge variant="secondary">{metric.representation}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                          {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-semibold text-blue-600">{metric.current}%</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-semibold text-green-600">{metric.target}%</div>
                        <div className="text-xs text-muted-foreground">Target</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-lg font-semibold">{metric.industry}%</div>
                        <div className="text-xs text-muted-foreground">Industry Avg</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-semibold text-purple-600">
                          {Math.round((metric.current / metric.target) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Goal Progress</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Target</span>
                        <span>{metric.current}% / {metric.target}%</span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inclusion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Inclusion Survey Results
              </CardTitle>
              <CardDescription>
                Employee sentiment across key inclusion dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inclusionScores.map((dept) => (
                  <div key={dept.department} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{dept.department}</h3>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{dept.responseRate}% response rate</Badge>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(dept.overallScore)}`}>
                            {dept.overallScore}
                          </div>
                          <div className="text-xs text-muted-foreground">Overall Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      {[
                        { name: "Belonging", score: dept.belonging },
                        { name: "Fairness", score: dept.fairness },
                        { name: "Respect", score: dept.respect },
                        { name: "Voice", score: dept.voice },
                        { name: "Growth", score: dept.growth }
                      ].map((dimension) => (
                        <div key={dimension.name} className="text-center p-3 bg-muted/30 rounded">
                          <div className={`text-lg font-semibold ${getScoreColor(dimension.score)}`}>
                            {dimension.score}
                          </div>
                          <div className="text-xs text-muted-foreground">{dimension.name}</div>
                          <Progress value={dimension.score} className="h-1 mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Survey Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Strengths</h4>
                  <div className="space-y-2">
                    <div className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                      Sales team reports highest belonging scores (88/100)
                    </div>
                    <div className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                      Respect scores consistently high across all departments
                    </div>
                    <div className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                      High survey participation indicates engagement (91% avg)
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-600 mb-3">Improvement Areas</h4>
                  <div className="space-y-2">
                    <div className="text-sm p-2 bg-orange-50 rounded border-l-2 border-orange-300">
                      Product team shows lowest voice scores (71/100)
                    </div>
                    <div className="text-sm p-2 bg-orange-50 rounded border-l-2 border-orange-300">
                      Engineering belonging needs attention (76/100)
                    </div>
                    <div className="text-sm p-2 bg-orange-50 rounded border-l-2 border-orange-300">
                      Growth opportunities feedback varies significantly
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hiring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Hiring Diversity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {Math.round((totalDiverseHires / totalHires) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">YTD Diverse Hiring Rate</div>
                  </div>
                  <div className="space-y-3">
                    {hiringData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{month.diverseHires}/{month.totalHires}</span>
                          <Progress value={month.percentage} className="w-20 h-2" />
                          <span className="text-sm w-12">{month.percentage}%</span>
                          {month.percentage >= month.target && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Promotion Equity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotionData.map((level) => (
                    <div key={level.level} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{level.level}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{level.diversePromotions}/{level.totalPromotions}</span>
                          <Badge 
                            variant={level.equityGap > -5 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {level.equityGap > 0 ? '+' : ''}{level.equityGap}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={level.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {level.percentage}% diverse promotions
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hiring & Promotion Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">58%</div>
                  <div className="text-sm font-medium">Entry-level Diversity</div>
                  <div className="text-xs text-muted-foreground">Exceeding 50% target</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">33%</div>
                  <div className="text-sm font-medium">Senior Promotions</div>
                  <div className="text-xs text-muted-foreground">Below 50% target</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">+12%</div>
                  <div className="text-sm font-medium">YoY Improvement</div>
                  <div className="text-xs text-muted-foreground">In leadership hires</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pay-equity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Pay Equity Analysis
              </CardTitle>
              <CardDescription>
                Compensation analysis across demographic groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payEquityData.map((group) => (
                  <div key={group.demographic} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{group.demographic}</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold">${group.avgSalary.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Average Salary</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded">
                        <div className={`text-lg font-semibold ${getGapColor(group.payGap)}`}>
                          {group.payGap.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Raw Pay Gap</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className={`text-lg font-semibold ${getGapColor(group.medianGap)}`}>
                          {group.medianGap.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Median Gap</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className={`text-lg font-semibold ${getGapColor(group.adjustedGap)}`}>
                          {group.adjustedGap.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Adjusted Gap</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pay Equity Score</span>
                        <span className={getGapColor(group.adjustedGap)}>
                          {Math.round(100 - Math.abs(group.adjustedGap))}%
                        </span>
                      </div>
                      <Progress value={100 - Math.abs(group.adjustedGap)} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                D&I Goals & Action Plans
              </CardTitle>
              <CardDescription>
                Track progress and manage action items for diversity and inclusion initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                    <div className="text-sm font-medium">Goals Achieved</div>
                    <div className="text-xs text-muted-foreground">This year</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                    <div className="text-sm font-medium">Active Initiatives</div>
                    <div className="text-xs text-muted-foreground">In progress</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
                    <div className="text-sm font-medium">Overall Progress</div>
                    <div className="text-xs text-muted-foreground">To annual goals</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4">2024 Key Initiatives</h4>
                  <div className="space-y-4">
                    {[
                      {
                        initiative: "Inclusive Leadership Training",
                        status: "In Progress",
                        progress: 75,
                        target: "Q4 2024",
                        impact: "All managers trained in inclusive leadership practices"
                      },
                      {
                        initiative: "Diverse Talent Pipeline Program",
                        status: "On Track",
                        progress: 90,
                        target: "Q3 2024",
                        impact: "Partnership with 5 HBCUs and 3 coding bootcamps"
                      },
                      {
                        initiative: "Pay Equity Audit & Adjustment",
                        status: "Completed",
                        progress: 100,
                        target: "Q2 2024",
                        impact: "Eliminated 98% of unexplained pay gaps"
                      },
                      {
                        initiative: "Employee Resource Groups Expansion",
                        status: "In Progress",
                        progress: 60,
                        target: "Q4 2024",
                        impact: "Launch 3 new ERGs with executive sponsorship"
                      }
                    ].map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium">{item.initiative}</h5>
                            <p className="text-sm text-muted-foreground">{item.impact}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              item.status === "Completed" ? "default" :
                              item.status === "On Track" ? "secondary" : "outline"
                            }>
                              {item.status}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">Target: {item.target}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4 justify-center">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export D&I Report
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Review
                  </Button>
                  <Button variant="outline">
                    Set New Goals
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
