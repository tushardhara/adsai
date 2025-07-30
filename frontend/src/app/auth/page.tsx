'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, ArrowLeft, Shield, Zap, Users, CheckCircle } from 'lucide-react'
import { signIn } from "next-auth/react"

export default function AuthPage() {
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
              {/* Google Sign-in Button */}
              <Button
                onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                className="w-full h-12 text-lg bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure authentication via Auth0</span>
                </div>
              </div>

              {/* Benefits info */}
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>One-click access to your Aura account</p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">Fast Setup</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">Secure</span>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">No Passwords</span>
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