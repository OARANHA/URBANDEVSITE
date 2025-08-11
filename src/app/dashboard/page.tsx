'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  AreaChart,
  StatCard 
} from '@/components/charts'
import { 
  Users, 
  FolderOpen, 
  Zap, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Bot,
  Workflow,
  Shield,
  Settings,
  Bell,
  Search,
  Plus,
  Sparkles,
  ArrowRight,
  BarChart3,
  Target,
  Database,
  Cpu
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  activeProjects: number
  totalFlows: number
  activeFlows: number
  systemUptime: string
  lastUpdated: string
}

interface DashboardAnalytics {
  userGrowth: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  projectStats: {
    byStatus: Record<string, number>
    byCategory: Record<string, number>
  }
  flowPerformance: {
    averageExecutionTime: number
    successRate: number
    totalExecutions: number
    errorRate: number
  }
  systemMetrics: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    networkLatency: number
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const { user: authUser, loading: authLoading, isConfigured, signOut } = useAuth()

  useEffect(() => {
    if (!authLoading && authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
        avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
      })
      setLoading(false)
    } else if (!authLoading && !authUser) {
      setLoading(false)
    }
  }, [authUser, authLoading])

  useEffect(() => {
    if (authUser && isConfigured) {
      fetchDashboardData()
    }
  }, [authUser, isConfigured])

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true)
      
      // Mock data for demonstration
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalProjects: 156,
        activeProjects: 124,
        totalFlows: 423,
        activeFlows: 387,
        systemUptime: '99.9%',
        lastUpdated: new Date().toISOString()
      }

      const mockAnalytics: DashboardAnalytics = {
        userGrowth: {
          daily: [12, 19, 15, 25, 22, 30, 28],
          weekly: [65, 78, 90, 81, 95, 102, 118],
          monthly: [320, 378, 425, 467, 512, 578, 624, 689, 745, 812, 878, 924]
        },
        projectStats: {
          byStatus: { active: 124, completed: 89, paused: 23, archived: 15 },
          byCategory: { automation: 67, analytics: 45, integration: 32, monitoring: 12 }
        },
        flowPerformance: {
          averageExecutionTime: 2.3,
          successRate: 98.5,
          totalExecutions: 15420,
          errorRate: 1.5
        },
        systemMetrics: {
          cpuUsage: 45,
          memoryUsage: 62,
          diskUsage: 34,
          networkLatency: 12
        }
      }

      setStats(mockStats)
      setAnalytics(mockAnalytics)
    } catch (err) {
      setError('Failed to fetch dashboard data')
    } finally {
      setDataLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (err) {
      setError('Failed to logout')
    }
  }

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertDescription>
              Supabase não está configurado. Por favor, configure as variáveis de ambiente.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link href="http://localhost:3001/login" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-orange-500 to-blue-700 hover:from-orange-600 hover:to-blue-800 text-white">
                Ir para Configuração
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!authUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Você precisa estar logado para acessar esta página.</p>
          <Link href="http://localhost:3001/login" target="_blank" rel="noopener noreferrer">
            <Button
              className="mt-4 bg-gradient-to-r from-orange-500 to-blue-700 hover:from-orange-600 hover:to-blue-800 text-white"
            >
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Carregando dados do dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isDark ? 'bg-gray-900/95 backdrop-blur border-gray-800' : 'bg-white/95 backdrop-blur border-gray-200'} border-b`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>UrbanDev</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className={`transition-colors ${isDark ? 'text-orange-400' : 'text-orange-600'} font-medium`}>Dashboard</Link>
              <a href="#" className={`transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Agentes</a>
              <a href="#" className={`transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Workflows</a>
              <a href="#" className={`transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Analytics</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name || user.email}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <div className="hidden md:block">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name || user?.email}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bem-vindo de volta, {user?.name || 'Usuário'}!
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Aqui está um resumo da sua atividade na plataforma UrbanDev
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Button className={`h-20 flex-col space-y-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border transition-colors`}>
              <Plus className="w-6 h-6" />
              <span className="text-sm">Novo Agente</span>
            </Button>
            <Button className={`h-20 flex-col space-y-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border transition-colors`}>
              <Workflow className="w-6 h-6" />
              <span className="text-sm">Novo Workflow</span>
            </Button>
            <Button className={`h-20 flex-col space-y-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border transition-colors`}>
              <Database className="w-6 h-6" />
              <span className="text-sm">Importar Dados</span>
            </Button>
            <Button className={`h-20 flex-col space-y-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border transition-colors`}>
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Ver Relatórios</span>
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total de Agentes
                  </CardTitle>
                  <Bot className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.activeFlows}
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Workflows Ativos
                  </CardTitle>
                  <Workflow className="h-4 w-4 text-blue-700" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.activeProjects}
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    +8% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Taxa de Sucesso
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {analytics?.flowPerformance.successRate || '98.5'}%
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    +2% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Uptime do Sistema
                  </CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.systemUptime}
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Sistema estável
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Section */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className={`grid w-full grid-cols-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <TabsTrigger value="overview" className={isDark ? 'data-[state=active]:bg-gray-700' : ''}>Visão Geral</TabsTrigger>
              <TabsTrigger value="performance" className={isDark ? 'data-[state=active]:bg-gray-700' : ''}>Performance</TabsTrigger>
              <TabsTrigger value="analytics" className={isDark ? 'data-[state=active]:bg-gray-700' : ''}>Análises</TabsTrigger>
              <TabsTrigger value="system" className={isDark ? 'data-[state=active]:bg-gray-700' : ''}>Sistema</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                {analytics && (
                  <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <CardHeader>
                      <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Crescimento de Agentes</CardTitle>
                      <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        Novos agentes criados nos últimos 7 dias
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LineChart
                        data={analytics.userGrowth.daily.map((value, index) => ({
                          label: `Dia ${index + 1}`,
                          value
                        }))}
                        xAxisKey="label"
                        lines={[{
                          dataKey: 'value',
                          stroke: '#f97316',
                          name: 'Novos Agentes'
                        }]}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Project Status Chart */}
                {analytics && (
                  <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <CardHeader>
                      <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Status dos Workflows</CardTitle>
                      <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        Distribuição de workflows por status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PieChart
                        data={Object.entries(analytics.projectStats.byStatus).map(([name, value]) => ({
                          name: name.charAt(0).toUpperCase() + name.slice(1),
                          value,
                          color: name === 'active' ? '#f97316' : 
                                 name === 'completed' ? '#1d4ed8' :
                                 name === 'paused' ? '#eab308' : '#dc2626'
                        }))}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analytics && (
                  <>
                    <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <CardHeader>
                        <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Tempo de Execução</CardTitle>
                        <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Tempo médio de execução dos workflows
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {analytics.flowPerformance.averageExecutionTime}s
                          </div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Média dos últimos 30 dias
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <CardHeader>
                        <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Total de Execuções</CardTitle>
                        <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Execuções no último mês
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {analytics.flowPerformance.totalExecutions.toLocaleString()}
                          </div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            +15% em relação ao mês anterior
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analytics && (
                  <>
                    <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <CardHeader>
                        <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Uso do Sistema</CardTitle>
                        <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        Atividade dos últimos 7 dias
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BarChart
                          data={analytics.userGrowth.daily.map((value, index) => ({
                            label: `Dia ${index + 1}`,
                            value
                          }))}
                          xAxisKey="label"
                          bars={[{
                            dataKey: 'value',
                            fill: '#1d4ed8',
                            name: 'Atividade'
                          }]}
                        />
                      </CardContent>
                    </Card>

                    <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <CardHeader>
                        <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Categorias</CardTitle>
                        <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Workflows por categoria
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(analytics.projectStats.byCategory).map(([category, count]) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </span>
                              <Badge variant="secondary">{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              {analytics && (
                <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Métricas do Sistema</CardTitle>
                    <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Uso de recursos do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Uso de CPU</span>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>{analytics.systemMetrics.cpuUsage}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{ width: `${analytics.systemMetrics.cpuUsage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Uso de Memória</span>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>{analytics.systemMetrics.memoryUsage}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="bg-blue-700 h-2 rounded-full" 
                              style={{ width: `${analytics.systemMetrics.memoryUsage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Uso de Disco</span>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>{analytics.systemMetrics.diskUsage}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${analytics.systemMetrics.diskUsage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Latência de Rede</span>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>{analytics.systemMetrics.networkLatency}ms</span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(analytics.systemMetrics.networkLatency * 2, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}