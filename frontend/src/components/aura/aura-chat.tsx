'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MessageSquare,
  Send,
  Bot,
  User,
  Settings,
  History,
  BarChart3,
  TrendingUp,
  Zap,
  Brain,
  Lightbulb,
  Target,
  RefreshCw,
  Download,
  Share,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Database,
  FileText,
  Image,
  PieChart
} from 'lucide-react';
import { toast } from 'sonner';
import { useDashboard } from '@/app/dashboard/providers/dashboard-provider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  artifacts?: Artifact[];
  metadata?: {
    tokens?: number;
    cost?: number;
    processingTime?: number;
  };
}

interface Artifact {
  id: string;
  type: 'chart' | 'table' | 'report' | 'recommendation' | 'strategy';
  title: string;
  data: any;
  description?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
  projectId: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'custom';
  description: string;
  maxTokens: number;
  costPer1kTokens: number;
  strengths: string[];
  recommended: boolean;
}

const availableModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: 'Advanced reasoning and complex analysis',
    maxTokens: 8192,
    costPer1kTokens: 0.03,
    strengths: ['Complex reasoning', 'Code generation', 'Strategic analysis'],
    recommended: true
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    description: 'Balanced performance for most analytics tasks',
    maxTokens: 100000,
    costPer1kTokens: 0.015,
    strengths: ['Long context', 'Analysis', 'Writing'],
    recommended: false
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: 'Fast responses for quick insights',
    maxTokens: 100000,
    costPer1kTokens: 0.0025,
    strengths: ['Speed', 'Cost-effective', 'Quick insights'],
    recommended: false
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Cost-effective for routine questions',
    maxTokens: 4096,
    costPer1kTokens: 0.002,
    strengths: ['Cost-effective', 'Speed', 'General purpose'],
    recommended: false
  }
];

const quickPrompts = [
  {
    icon: TrendingUp,
    title: "Analyze Campaign Performance",
    prompt: "Analyze my current campaign performance across all platforms. What are the key insights and optimization opportunities?"
  },
  {
    icon: Target,
    title: "Optimize Ad Spend",
    prompt: "Review my ad spend allocation across channels. How should I redistribute budget for maximum ROAS?"
  },
  {
    icon: BarChart3,
    title: "Revenue Attribution",
    prompt: "Help me understand which marketing channels are driving the most revenue and conversions."
  },
  {
    icon: Lightbulb,
    title: "Growth Strategy",
    prompt: "Based on my data, what are the top 3 strategies I should implement to scale my D2C brand?"
  }
];

export function AuraChat() {
  const { currentProject } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedArtifacts, setExpandedArtifacts] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
    initializeWelcomeMessage();
  }, [currentProject]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/aura/conversations?projectId=${currentProject?.id}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      // Don't show error toast for initial load
    }
  };

  const initializeWelcomeMessage = () => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm Aura, your AI analytics assistant for ${currentProject?.name || 'your D2C brand'}. 

I can help you:
🎯 Analyze campaign performance across all platforms
📊 Optimize ad spend and budget allocation  
🚀 Identify growth opportunities and strategies
📈 Generate detailed reports and visualizations
💡 Provide actionable insights from your data

What would you like to explore today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/aura/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage.trim(),
          model: selectedModel,
          projectId: currentProject?.id,
          conversationId: currentConversationId,
          context: messages.slice(-5) // Last 5 messages for context
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: data.messageId,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        model: selectedModel,
        artifacts: data.artifacts || [],
        metadata: {
          tokens: data.tokens,
          cost: data.cost,
          processingTime: data.processingTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation ID if it's a new conversation
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
        fetchConversations(); // Refresh conversation list
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setCurrentMessage(prompt);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    initializeWelcomeMessage();
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/aura/conversations/${conversationId}`);
      if (!response.ok) throw new Error('Failed to load conversation');
      
      const data = await response.json();
      setMessages(data.messages || []);
      setCurrentConversationId(conversationId);
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      toast.error('Failed to load conversation');
    }
  };

  const toggleArtifact = (artifactId: string) => {
    setExpandedArtifacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artifactId)) {
        newSet.delete(artifactId);
      } else {
        newSet.add(artifactId);
      }
      return newSet;
    });
  };

  const renderArtifact = (artifact: Artifact) => {
    const isExpanded = expandedArtifacts.has(artifact.id);
    
    return (
      <Card key={artifact.id} className="mt-3 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {artifact.type === 'chart' && <BarChart3 className="w-4 h-4 text-blue-600" />}
              {artifact.type === 'table' && <Database className="w-4 h-4 text-green-600" />}
              {artifact.type === 'report' && <FileText className="w-4 h-4 text-purple-600" />}
              {artifact.type === 'recommendation' && <Lightbulb className="w-4 h-4 text-orange-600" />}
              {artifact.type === 'strategy' && <Target className="w-4 h-4 text-red-600" />}
              <CardTitle className="text-sm">{artifact.title}</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => toggleArtifact(artifact.id)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          {artifact.description && (
            <p className="text-xs text-gray-600">{artifact.description}</p>
          )}
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="bg-gray-50 rounded-lg p-4">
              {artifact.type === 'chart' && (
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Chart visualization would render here</p>
                </div>
              )}
              {artifact.type === 'table' && (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Data table would render here</p>
                </div>
              )}
              {(artifact.type === 'report' || artifact.type === 'recommendation' || artifact.type === 'strategy') && (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(artifact.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const getCurrentModel = () => availableModels.find(m => m.id === selectedModel);

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="border-b bg-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Aura AI Assistant</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Model: {getCurrentModel()?.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getCurrentModel()?.provider}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={startNewConversation}>
                <MessageSquare className="w-4 h-4 mr-1" />
                New Chat
              </Button>
              
              <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Chat History</DialogTitle>
                    <DialogDescription>
                      Previous conversations for {currentProject?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {conversations.length === 0 ? (
                      <p className="text-sm text-gray-600 text-center py-4">
                        No previous conversations
                      </p>
                    ) : (
                      conversations.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => loadConversation(conversation.id)}
                        >
                          <h4 className="font-medium text-sm">{conversation.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{conversation.updatedAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{conversation.messages.length} messages</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showModelSettings} onOpenChange={setShowModelSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>AI Model Settings</DialogTitle>
                    <DialogDescription>
                      Choose the AI model that best fits your needs
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {availableModels.map((model) => (
                      <div 
                        key={model.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedModel === model.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedModel(model.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{model.name}</h4>
                              {model.recommended && (
                                <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {model.strengths.map((strength) => (
                                <Badge key={strength} variant="outline" className="text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-medium">${model.costPer1kTokens}/1K tokens</p>
                            <p className="text-xs text-gray-500">{model.maxTokens.toLocaleString()} max tokens</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {quickPrompts.map((prompt) => (
                <Card 
                  key={prompt.title}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <prompt.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{prompt.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{prompt.prompt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                <div className={`rounded-lg px-4 py-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white ml-auto' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.metadata && (
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <Clock className="w-3 h-3" />
                      <span>{message.metadata.processingTime}ms</span>
                      {message.metadata.tokens && (
                        <>
                          <span>•</span>
                          <span>{message.metadata.tokens} tokens</span>
                        </>
                      )}
                      {message.metadata.cost && (
                        <>
                          <span>•</span>
                          <span>${message.metadata.cost.toFixed(4)}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {message.artifacts && message.artifacts.length > 0 && (
                  <div className="mt-2">
                    {message.artifacts.map(renderArtifact)}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">Aura is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4 flex-shrink-0">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Aura about your analytics, campaigns, or growth strategies..."
                className="min-h-[60px] max-h-32 resize-none"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Model: {getCurrentModel()?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}