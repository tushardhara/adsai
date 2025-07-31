'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface Project {
  id: string
  name: string
  createdAt: Date
  userId: string
  integrations?: Integration[]
}

interface Integration {
  id: string
  type: 'facebook' | 'shopify' | 'google_ads' | 'amazon_ads'
  status: 'connected' | 'pending' | 'error'
  lastSync?: Date
}

interface DashboardContextType {
  currentProject: Project | null
  projects: Project[]
  isLoading: boolean
  error: string | null
  setCurrentProject: (project: Project) => void
  refreshProjects: () => Promise<void>
  createProject: (name: string) => Promise<Project>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

interface DashboardProviderProps {
  children: ReactNode
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { data: session, status } = useSession()
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth')
    }
  }, [status])

  // Fetch user projects when session is available
  useEffect(() => {
    if (session?.user?.email && status === 'authenticated') {
      fetchProjects()
    }
  }, [session, status])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call to Go backend
      // const response = await fetch('/api/projects', {
      //   headers: {
      //     'Authorization': `Bearer ${session.accessToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to fetch projects')
      // }
      // 
      // const data = await response.json()
      // setProjects(data.projects || [])
      
      // Mock data for development - following multi-tenant architecture
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'StyleCo Fashion',
          createdAt: new Date('2024-01-15'),
          userId: session?.user?.email || '',
          integrations: [
            {
              id: '1',
              type: 'facebook',
              status: 'connected',
              lastSync: new Date()
            },
            {
              id: '2', 
              type: 'shopify',
              status: 'connected',
              lastSync: new Date()
            }
          ]
        },
        {
          id: '2',
          name: 'TechGear Store',
          createdAt: new Date('2024-01-20'),
          userId: session?.user?.email || '',
          integrations: [
            {
              id: '3',
              type: 'google_ads',
              status: 'connected',
              lastSync: new Date()
            }
          ]
        }
      ]
      
      setProjects(mockProjects)
      
      // Set current project to first project if none selected
      if (mockProjects.length > 0 && !currentProject) {
        setCurrentProject(mockProjects[0])
      }
      
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to load projects')
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProjects = async () => {
    await fetchProjects()
  }

  const createProject = async (name: string): Promise<Project> => {
    try {
      setError(null)
      
      // TODO: Replace with actual API call to Go backend
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${session.accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ name })
      // })
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create project')
      // }
      // 
      // const newProject = await response.json()
      
      // Mock project creation
      const newProject: Project = {
        id: Date.now().toString(),
        name: name.trim(),
        createdAt: new Date(),
        userId: session?.user?.email || '',
        integrations: []
      }
      
      const updatedProjects = [...projects, newProject]
      setProjects(updatedProjects)
      setCurrentProject(newProject)
      
      return newProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Show loading spinner while session is loading
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render if no session
  if (!session) {
    return null
  }

  const value: DashboardContextType = {
    currentProject,
    projects,
    isLoading,
    error,
    setCurrentProject,
    refreshProjects,
    createProject
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}