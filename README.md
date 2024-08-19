# Megaverse Generator

## Overview

The Megaverse Generator is a TypeScript application that creates and manages a grid-based universe filled with various entities such as Polyanets, Soloons, and Comeths. The system interacts with a remote server to create and manipulate these entities.

## Project Structure

The project is structured as follows:

- `src/`: Contains the main source code
  - `index.ts`: Entry point of the application
  - `Megaverse.ts`: Main class for managing the Megaverse
  - `entities.ts`: Defines the entity classes (Polyanet, Soloon, Cometh)
  - `Megaverse.types.ts`: TypeScript type definitions
  - `utils/`: Utility functions and classes
    - `logger.ts`: Logging functionality
    - `RateLimiter.ts`: Rate limiting implementation
- `data.json`: Contains the target configuration for the Megaverse
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `jest.config.js`: Jest testing configuration
- `nodemon.json`: Nodemon configuration for development
- `.vscode/`: VS Code specific configurations
- `logs/`: Directory for log files

## Key Components

1. **Megaverse Class**: The main class that manages the grid and entity placement.
2. **Entity Classes**: Polyanet, Soloon, and Cometh classes that represent different entities in the Megaverse.
3. **Logger**: A custom logger using Winston for console and file logging.
4. **Rate Limiter**: A utility class to manage API request rates.

## Setup and Running the Application

1. **Environment Setup**:
   - Ensure Node.js (v18.18.0 or later) is installed.
   - Install dependencies: `npm install` or `yarn install`

2. **Configuration**:
   - Set up environment variables:
     - `CANDIDATE_ID`: Your unique candidate ID
     - `RATE_LIMIT`: API rate limit (default: 10)
     - `GRID_SIZE`: Size of the Megaverse grid (default: 30)

3. **Running the Application**:
   - Development mode: `npm run start` or `yarn start`
   - Production build: 
     1. `npm run build` or `yarn build`
     2. `node dist/index.js`

4. **Testing**:
   - Run tests: `npm test` or `yarn test`

5. **Linting and Formatting**:
   - Lint: `npm run lint` or `yarn lint`
   - Format: `npm run format` or `yarn format`

## Main Functionality

The application performs the following main tasks:

1. Initializes a Megaverse grid based on the configuration in `data.json`.
2. Creates entities (Polyanets, Soloons, Comeths) on the grid.
3. Interacts with a remote server to persist these entities.
4. Manages rate limiting for API requests.
5. Logs operations and errors to console and files.

## Logging

- Application logs are stored in the `logs/` directory:
  - `megaverse.log`: General application logs
  - `error.log`: Error-specific logs

## Debugging

- VS Code launch configuration is provided for debugging.

## Notes

- The application uses a rate limiter to manage API requests. Adjust the `RATE_LIMIT` environment variable if needed.
- Error handling is implemented to catch and log various issues during entity creation and management.
- The Megaverse state can be visualized using emojis in the console output.

## Future Improvements

- Implement more robust error recovery mechanisms.
- Add more comprehensive unit and integration tests.
- Optimize the initialization process for larger grids.
- Implement a user interface for visual representation and interaction with the Megaverse.

This documentation provides an overview of the current implementation and instructions on how to set up and run the Megaverse Generator. For more detailed information on specific components, refer to the inline comments in the source code.