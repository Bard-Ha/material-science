# Overview

Mat-Sci-AI is an advanced material discovery platform that combines artificial intelligence with materials science to predict material properties and compositions. The application provides a comprehensive web-based interface for researchers and engineers to analyze materials, predict their characteristics, and explore Ethiopian mineral resources. It features dual prediction capabilities: predicting compositions from desired properties and predicting properties from known compositions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built using React with TypeScript, implementing a modern component-based architecture. The UI leverages shadcn/ui components for consistent design patterns and Tailwind CSS for styling with a dark theme optimized for scientific applications. The application uses Wouter for client-side routing and React Query (TanStack Query) for efficient data fetching and state management.

The frontend follows a modular structure with separate pages for Dashboard, Analysis, Database management, and AI Lab functionality. Components are organized into reusable UI elements, forms for data input, and specialized visualization components for material data presentation.

## Backend Architecture

The server implements a REST API using Express.js with TypeScript, following a service-oriented architecture. The application uses a modular routing system that separates concerns between API endpoints and business logic. Core services include AI integration for material predictions and data storage management.

The backend architecture supports both in-memory storage (for development) and database persistence through Drizzle ORM with PostgreSQL. This dual approach allows for flexible deployment scenarios while maintaining consistent data access patterns.

## Data Storage Solutions

The application uses Drizzle ORM as the database abstraction layer with PostgreSQL as the primary database. The schema includes tables for users, material predictions, Ethiopian materials database, and comprehensive material properties. The storage layer implements an interface-based approach, allowing for pluggable storage implementations including an in-memory option for development and testing.

Database migrations are managed through Drizzle Kit, and the schema supports complex nested JSON data structures for material compositions and properties. Connection pooling is handled through Neon Database's serverless PostgreSQL solution.

## Authentication and Authorization

The application includes user management capabilities with password-based authentication. Session management is implemented using PostgreSQL-backed sessions through connect-pg-simple middleware. User data is stored with UUID primary keys for scalability and security.

## API Design Patterns

The REST API follows RESTful conventions with clear endpoint structures for material predictions, Ethiopian materials database access, and user management. Request/response validation is implemented using Zod schemas, ensuring type safety across the full stack. Error handling provides meaningful feedback for both client-side display and debugging purposes.

# External Dependencies

## AI Services Integration

The application integrates with OpenAI's GPT-5 model for advanced material property and composition predictions. The AI service layer abstracts the external API calls and handles response formatting, confidence scoring, and error management. The integration supports both properties-to-composition and composition-to-properties prediction workflows.

## Database Services

Neon Database provides serverless PostgreSQL hosting with connection pooling and automatic scaling. The database connection is configured through environment variables and supports both development and production deployment scenarios.

## UI Component Libraries

The application uses Radix UI primitives as the foundation for accessible, customizable components. These are enhanced through shadcn/ui component patterns and styled with Tailwind CSS. The component library includes form controls, data visualization elements, charts through Recharts, and responsive layout systems.

## Build and Development Tools

The development workflow uses Vite for fast builds and hot module replacement, with ESBuild for production bundling. TypeScript provides type safety across the entire application, with shared schema definitions between client and server. The build system supports both development and production modes with appropriate optimizations for each environment.

## Styling and Theming

Tailwind CSS provides utility-first styling with a custom configuration optimized for scientific applications. The design system includes CSS custom properties for consistent theming, with special focus on dark mode presentation suitable for laboratory and research environments. Font loading includes scientific and monospace typefaces from Google Fonts.