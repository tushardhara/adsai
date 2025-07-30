'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, ArrowLeft, Shield, Zap, Users, CheckCircle } from 'lucide-react'

export default function AuthPage() {
  const handleAuth0Login = () => {
    window.location.href = '/api/auth/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="space-y-8">
          {/* Logo and back link */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Aura</span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Heading */}
          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered Analytics Platform
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join 500+ D2C brands growing with 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Aura</span>
            </h1>
            <p className="text-lg text-gray-600">
              Connect your data sources, chat with AI, and get intelligent insights to optimize your campaigns and grow your business.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-700">14-day free trial • No credit card required</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Enterprise-grade security with Auth0</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-700">Team collaboration & real-time insights</span>
            </div>
          </div>

          {/* Social proof */}
          <div className="border-l-4 border-blue-600 pl-4 bg-white/50 rounded-r-lg p-4">
            <p className="text-gray-600 italic mb-2">
              "Aura helped us increase our ROAS by 40% in just 2 months. The AI insights are game-changing."
            </p>
            <p className="text-sm font-medium text-gray-900">Sarah Chen, CMO at StyleCo</p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Get Started with Aura
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in or create your account to start analyzing your D2C data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auth0 Login Button */}
              <Button
                onClick={handleAuth0Login}
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Continue with Auth0
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure authentication</span>
                </div>
              </div>

              {/* Auth options info */}
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>Continue with your preferred method:</p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded">Google</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">Microsoft</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">Email</span>
                </div>
              </div>

              {/* Terms and privacy */}
              <div className="text-xs text-gray-500 text-center">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>GDPR Ready</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}