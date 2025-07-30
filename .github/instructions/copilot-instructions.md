---
applyTo: '**'
---

# Aura - D2C Analytics Platform - AI Coding Instructions

## Project Overview
Aura is an AI-powered analytics platform for D2C brands that connects to multiple data sources (Facebook, Shopify, etc.) and provides intelligent insights through Claude AI integration. Built with Next.js frontend, Go backend on AWS Lambda, and PostgreSQL database.

## Tech Stack Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS for responsive design
- **Authentication**: Auth0 for user management
- **Hosting**: AWS S3 + CloudFront for static site deployment
- **State Management**: React hooks and Context API
- **HTTP Client**: Fetch API with custom hooks

### Backend (Go + AWS)
- **Runtime**: Go 1.21+ on AWS Lambda
- **API Gateway**: REST APIs with Lambda integration
- **Database**: PostgreSQL (AWS RDS)
- **Authentication**: Auth0 JWT validation
- **External APIs**: Facebook Graph API, Shopify API, Claude API

### Infrastructure & DevOps
- **IaC**: AWS CloudFormation templates
- **CI/CD**: GitHub Actions for automated deployment
- **Database Migrations**: Atlas CLI for schema management
- **Secrets**: AWS Systems Manager Parameter Store
- **Monitoring**: CloudWatch logs and metrics

## Project Structure

```
adsai/
├── frontend/                    # Next.js application
│   └── package.json
├── backend/                     # Go Lambda functions
│   ├── cmd/                    # Lambda entry points
│   │   ├── auth/               # Authentication Lambda
│   │   ├── projects/           # Project management Lambda
│   │   ├── integrations/       # Data source integrations
│   │   └── aura/               # Aura AI chat Lambda
│   ├── internal/               # Private application code
│   │   ├── auth/               # Auth0 JWT validation
│   │   ├── database/           # PostgreSQL operations
│   │   ├── handlers/           # HTTP request handlers
│   │   ├── models/             # Data models
│   │   ├── services/           # Business logic
│   │   │   ├── facebook/       # Facebook API integration
│   │   │   ├── shopify/        # Shopify API integration
│   │   │   └── claude/         # Claude AI integration
│   │   └── middleware/         # HTTP middleware
│   ├── pkg/                    # Shared library code
│   └── go.mod
├── database/                    # Database schema and migrations
│   ├── atlas.hcl               # Atlas configuration file
│   ├── migrations/             # Atlas migration files
│   ├── schema/                 # Atlas schema definitions
│   │   ├── schema.sql          # Complete schema definition
│   │   ├── users.sql           # Users table schema
│   │   ├── projects.sql        # Projects table schema
│   │   ├── integrations.sql    # Data source integrations
│   │   └── conversations.sql   # Aura chat history
│   └── seeds/                  # Test data for development
├── infrastructure/              # CloudFormation templates
│   ├── templates/
│   │   ├── vpc.yaml            # Network infrastructure
│   │   ├── database.yaml       # RDS PostgreSQL
│   │   ├── lambda.yaml         # Lambda functions
│   │   ├── api-gateway.yaml    # API Gateway
│   │   ├── auth0.yaml          # Auth0 configuration
│   │   └── frontend.yaml       # S3 + CloudFront
│   ├── parameters/             # Environment-specific parameters
│   │   ├── dev.json
│   │   ├── staging.json
│   │   └── prod.json
│   └── deploy.sh
├── .github/workflows/          # CI/CD pipelines
│   ├── frontend-deploy.yml     # Frontend deployment
│   ├── backend-deploy.yml      # Backend deployment
│   ├── database-migrate.yml    # Atlas database migrations
│   └── infrastructure-deploy.yml
└── scripts/                    # Deployment and utility scripts
    ├── setup-dev.sh            # Development environment setup
    ├── deploy-all.sh           # Complete deployment script
    └── atlas-setup.sh          # Atlas CLI setup script
```

## User Journey & Features

### Core User Flow
1. **Home Page**: Landing page with product overview
2. **Auth0 Login/Signup**: Secure authentication
3. **Dashboard**: User's project overview
4. **Create Project**: Set up new D2C brand analysis
5. **Connect Data Sources**: 
   - **Ads Providers**: Facebook, Google Ads, Amazon Ads
   - **Data Providers**: Shopify, Amazon Marketplace, API integrations
6. **Aura AI Interface**: Chat with integrated dashboard and artifact support

### Key Components
- **Project Management**: Multi-tenant project isolation
- **Data Source Connectors**: OAuth flows for external APIs
- **Aura AI Engine**: Claude-powered analysis with artifact generation
- **Dashboard**: Real-time analytics and insights
- **Alert System**: Proactive notifications and recommendations

## Development Guidelines

### Go Backend Standards
- Use Go modules for dependency management
- Implement proper error handling with custom error types
- Use context.Context for request scoping and timeouts
- Follow Clean Architecture principles (handlers → services → repository)
- Use interfaces for external service integrations
- Implement proper logging with structured JSON logs
- Use AWS Lambda best practices for cold start optimization

### Frontend Standards
- Use TypeScript for type safety
- Implement proper error boundaries and loading states
- Use React Server Components where appropriate
- Follow Next.js 14 App Router conventions
- Implement proper SEO with metadata APIs
- Use Tailwind CSS utility classes consistently
- Implement Auth0 authentication flows

### Database Design with Atlas
- Use Atlas CLI for schema management and migrations
- Define schema in HCL or SQL format in `database/schema/`
- Use Atlas migrate for version-controlled migrations
- Implement proper indexing for performance
- Follow normalization principles but optimize for read performance
- Implement soft deletes for audit trails
- Store encrypted OAuth tokens securely

### API Design
- RESTful endpoints with proper HTTP status codes
- Consistent JSON response format with error handling
- Implement pagination for list endpoints
- Use Auth0 JWT for authentication and authorization
- Implement rate limiting and input validation
- Use API Gateway for request routing and throttling

## Key Workflows

### Development Workflow
```bash
# Frontend development
cd frontend && npm run dev

# Backend development (local)
cd backend && go run cmd/api/main.go

# Database schema management with Atlas
cd database && atlas schema apply --env dev

# Atlas migration generation
atlas migrate diff --env dev

# Infrastructure deployment
cd infrastructure && ./deploy.sh dev

# Run tests
cd backend && go test ./...
cd frontend && npm test
```

### Atlas Database Migration Workflow
```bash
# Generate new migration from schema changes
atlas migrate diff migration_name --env dev

# Apply migrations to database
atlas migrate apply --env dev

# Validate schema against database
atlas schema apply --dry-run --env dev

# Inspect current database schema
atlas schema inspect --env dev
```

### External API Integration Patterns
- Implement OAuth 2.0 flows for Facebook and Shopify
- Use retry logic with exponential backoff
- Implement circuit breaker pattern for external service calls
- Cache API responses where appropriate
- Handle rate limits gracefully with queuing
- Implement webhook handlers for real-time data updates

### Aura AI Integration
- Stream Claude API responses for real-time chat
- Implement artifact generation for graphs and reports
- Use structured prompts for consistent AI responses
- Implement conversation context and memory
- Cache AI responses for similar queries
- Track AI usage and costs per user/project

### Security Best Practices
- Never commit secrets or API keys
- Use AWS Parameter Store for sensitive configuration
- Validate all inputs and sanitize outputs
- Implement proper CORS policies
- Use HTTPS everywhere with proper certificates
- Encrypt sensitive data at rest and in transit
- Implement proper JWT validation and refresh flows

### Deployment Strategy
- Use GitHub Actions for CI/CD automation
- Implement infrastructure as code with CloudFormation
- Use Atlas for database schema deployments
- Use blue-green deployment for zero-downtime updates
- Implement proper rollback procedures
- Monitor application health with CloudWatch
- Use feature flags for gradual rollouts

## Project-Specific Patterns

### Multi-Tenant Architecture
- Project-based data isolation in database
- User authorization with project-level permissions
- Resource scoping for all API endpoints
- Audit logging for compliance and debugging

### Data Source Management
- Modular integration architecture for easy addition of new sources
- Standardized data transformation layer
- Incremental data synchronization with conflict resolution
- OAuth token management with automatic refresh

### Aura AI Architecture
- Conversation context management across sessions
- Progressive learning and personalization per project
- Proactive insight generation based on data patterns
- Trust-building progression for expanded permissions

### Atlas Schema Management
- Use declarative schema definitions in `database/schema/`
- Leverage Atlas migrate for automatic migration generation
- Implement schema validation in CI/CD pipelines
- Use Atlas environments for dev/staging/prod schema management
- Maintain schema documentation through Atlas introspection

This is a modern, scalable D2C analytics platform built with production-ready patterns, AWS best practices, and Atlas for robust database