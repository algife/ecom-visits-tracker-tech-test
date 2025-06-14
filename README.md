# E-Commerce Visits Tracker

A high-performance system for tracking and analyzing e-commerce website visits with real-time statistics by country.

> Author: Alexandre Giménez (cookingstartupscom@gmail.com)

## Features

- Real-time visit tracking by country
- Docker containerization for easy deployment
- Modern Next.js frontend with Aceternity UI
- High-load capability (1000+ requests/second)
- Rate Limiting by IP
- Redis-based caching for optimal performance
- Multi-core utilization with Node.js cluster mode
- Robust error handling and graceful shutdown
- Security features
- Test suite included
- Swagger documentation

## Tech Stack

- **Frontend**: Next.js, TypeScript, Aceternity UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: Redis
- **Infrastructure**: Docker, Nginx (reverse proxy)
- **Documentation**: Swagger

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/algife/ecom-visits-tracker-tech-test
cd ecom-visits-tracker-tech-test
```

2. Start the application:
```bash
npm run start
```

The application will be available at:
- **Frontend**: http://localhost:3001
- **Backend** API: http://localhost:3030
- **Swagger** Documentation: http://localhost:3030/api/v1/docs

## Development Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```env
NODE_ENV=development
PORT=3030
REDIS_HOST=localhost
REDIS_PORT=6379
```

4. Start the development server:
```bash
npm run dev
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3030/api/v1/
```

4. Start the development server:
```bash
npm run dev
```

## Testing

### Backend Tests

Run the test suite:
```bash
cd backend
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Frontend Tests

Run the test suite:
```bash
cd frontend
npm test
```

## API Documentation

The API documentation is available through Swagger UI at `/api/v1/docs` when running the backend server.

### Main Endpoints

- `GET /api/v1/ping` - Health check endpoint
- `GET /api/v1/stats` - Get visit statistics by country
- `POST /api/v1/stats?countryCode=:countryCode` - Increment visit count for a country

## Production Deployment

The application is containerized and can be deployed using Docker Compose by running one of the following commands:

```bash
npm run start
```

```bash
docker compose -f compose.yml up -d
```

## Performance Considerations

- Backend uses cluster mode in production for multi-core utilization
- Redis is configured for optimal performance with:
  - Memory management
  - Connection pooling
  - Persistence settings
- Rate limiting is enabled (100 req/min per single IP)
- Response compression is enabled

## Security Features

- Helmet.js for HTTP security headers
- CORS protection
- Rate limiting
- Request size limits
- Production error messages
 