import { Express } from 'express-serve-static-core';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import globalConfig from './global.config';
import CountryStatsSchema from '../models/schemas/CountryStats.schema';
import ErrorResponseSchema from '../models/schemas/ErrorResponse.schema';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Visits Tracker API Docs',
      version,
      description: 'API documentation for the E-Commerce Visits Tracker service',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3030/api/v1',
        description: 'Local Dev API',
      },
      {
        url: 'http://backend:3030/api/v1',
        description: 'Docker Local API',
      }
    ],
    components: {
      schemas: {
        CountryStats: CountryStatsSchema,
        ErrorResponse: ErrorResponseSchema,
      }
    },
    paths: {
      '/healthcheck': {
        get: {
          tags: ['Healthcheck'],
          summary: 'Health check / Ping endpoint',
          description: 'Returns a simple status 200 response to confirm server is running',
          responses: {
            '200': {
              description: 'Server is up and running'
            }
          }
        }
      },
      '/stats': {
        get: {
          tags: ['Statistics'],
          summary: 'Retrieve all country visit statistics',
          description: 'Returns a complete list of visit counts by country code',
          security: [{ rateLimit: [] }],
          responses: {
            '200': {
              description: 'successful response with the list of visits by countryCode',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CountryStats'
                  }
                }
              }
            },
            '429': {
              $ref: '#/components/responses/TooManyRequests'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        },
        post: {
          tags: ['Statistics'],
          summary: 'Record a new visit',
          description: 'Increments the visit counter for a specific country',
          security: [{ rateLimit: [] }],
          parameters: [
            {
              in: 'query',
              name: 'countryCode',
              required: true,
              description: 'ISO country code (e.g., US, GB)',
              schema: {
                type: 'string',
                minLength: 2,
                maxLength: 2,
                pattern: '^[A-Z]{2}$',
                example: 'US'
              }
            }
          ],
          responses: {
            '201': {
              description: 'Visit successfully recorded',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      countryCode: {
                        type: 'string',
                        example: 'US'
                      },
                      visits: {
                        type: 'integer',
                        example: 42
                      }
                    }
                  }
                }
              }
            },
            '422': {
              $ref: '#/components/responses/UnprocessableEntity'
            },
            '429': {
              $ref: '#/components/responses/TooManyRequests'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    },
  },
  // Remove apis array since we're defining paths directly
  apis: [

  ],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupDocumentation = (app: Express) => {
  const baseUrl = globalConfig.api.BASE_URL;

  app
    // ---- API Documentation (Swagger)
    .use(`${baseUrl}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    .get(`${baseUrl}/docs.json`, (req, res) => {
      // res.setHeader(`Content-Type`, `application/json`);
      res.json(swaggerSpec)
    })

  return app;
}
