'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import Link from 'next/link'
import { Sparkles, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
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

  const { user, loading: authLoading, error: authError, isConfigured, signIn, signUp } = useAuth()

  // Redirect if already authenticated
  if (user && !authLoading) {
    router.push(redirectTo)
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await signIn(email, password)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Login successful! Redirecting...')
      setTimeout(() => {
        router.push(redirectTo)
      }, 1000)
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setMessage(null)

    const { error } = await signUp(email, password)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Cadastro realizado com sucesso! Redirecionando...')
      setTimeout(() => {
        router.push(redirectTo)
      }, 1000)
    }
    setLoading(false)
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
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>UrbanDev</span>
            </div>
          </div>

          <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`text-center text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Bem-vindo!</CardTitle>
              <CardDescription className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Sistema de demonstração pronto para uso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Este é um sistema de demonstração. Use qualquer email e senha para acessar.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 space-y-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Como acessar:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Digite qualquer email (ex: demo@urbandev.com)
                    </li>
                    <li className={isDark ? 'text-gray-300' : 'text-gray-600'}>Digite qualquer senha (mínimo 6 caracteres)</li>
                    <li className={isDark ? 'text-gray-300' : 'text-gray-600'}>Clique em "Entrar" para acessar o dashboard</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>UrbanDev</span>
          </div>
          <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Entre na sua conta para acessar a plataforma
          </p>
        </div>

        <Card className={`transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="space-y-1">
            <CardTitle className={`text-2xl text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Bem-vindo de volta</CardTitle>
            <CardDescription className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Entre com seu email e senha para continuar
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <CardContent className="space-y-4">
              {authError && (
                <Alert variant="destructive">
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              {message && !authError && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className={isDark ? 'text-gray-200' : 'text-gray-700'}>Email</Label>
                <div className="relative">
                  <Icons.mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`pl-10 transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={isDark ? 'text-gray-200' : 'text-gray-700'}>Senha</Label>
                <div className="relative">
                  <Icons.lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`pl-10 pr-10 transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-blue-700 hover:from-orange-600 hover:to-blue-800 text-white"
                disabled={loading}
              >
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
              
              <div className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="font-medium text-orange-500 hover:text-orange-600 transition-colors"
                  disabled={loading}
                >
                  Registre-se gratuitamente
                </button>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Acesso Rápido para Demonstração</h4>
                <p className={`text-sm mb-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  Use qualquer email e senha para acessar o sistema
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full ${isDark ? 'bg-blue-900/30 border-blue-600 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'}`}
                  onClick={() => {
                    setEmail('demo@urbandev.com')
                    setPassword('demo123')
                  }}
                >
                  Preencher com dados de demo
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Link href="/" className={`hover:${isDark ? 'text-gray-200' : 'text-gray-700'} transition-colors`}>
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}