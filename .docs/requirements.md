# Ecom visits tracker technical test

## Requirements

### Back-end

1. Implement a REST API with Node.js that tracks website visits by country. It's allowed: the use of ready-made libraries, frameworks... It must contain:
- *UPDATE* statistics:
  - Accepts the countryCode:string as argument.
  - Request/sec: 1000 
- *GET* statistics:
  - Retrieve collected stats for all countries.
  - Returns a JSON obj:	`{  "cy": 123, "us": 456, "country_code": count, ... }`
  - Request/sec: 1000 
- Storage:
	- Redis

### Frontend

Create a website/web application to send requests to the backend and view the collected statistics.

## Evaluation Criteria
  - [ ] Code readability
  - [ ] Error handling
  - [ ] Testing
  - [ ] Documentation for running the project
  - [ ] Adaptability for deployment in any environment
  - [ ] Readiness for high load
