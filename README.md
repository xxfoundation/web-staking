# web-staking

## Description

`web-staking` is a web application designed to facilitate the staking of `xx` tokens. It provides an intuitive interface for users to seamlessly interact with the staking process.

## Table of Contents

- [web-staking](#web-staking)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Scripts](#scripts)
  - [Dependencies](#dependencies)
  - [Development](#development)
    - [Project Structure](#project-structure)
    - [Environment Variables](#environment-variables)
    - [Build Process](#build-process)
  - [Contributing](#contributing)
    - [Guidelines](#guidelines)
  - [License](#license)
  - [Contact](#contact)

## Installation

To get started with `web-staking`, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/xxfoundation/web-staking.git
   ```

2. Navigate to the project directory:

   ```bash
   cd web-staking
   ```

3. Install the necessary dependencies:
   ```bash
   yarn
   ```

## Usage

To start the application in development mode, use:

```bash
yarn start
```

The development server will run on port `3000`. Open your browser and navigate to `http://localhost:3000` to access the application.

## Scripts

The following scripts are available in the `package.json` file for development and production tasks:

- `start`: Launches the development server.
- `build`: Compiles the project using `react-app-rewired`.
- `test`: Runs the test suite.
- `eject`: Ejects the create-react-app configuration.
- `lint`: Checks the code for quality issues using ESLint.

## Dependencies

Key dependencies used in this project include:

- **React** and **React-DOM**: For building the user interface.
- **@apollo/client**: Manages GraphQL data.
- **@polkadot/api**: Interacts with the Polkadot blockchain.
- **@mui/material**: Provides Material-UI components.
- **Redux Toolkit**: Handles application state.

For a comprehensive list, refer to the `package.json` file.

## Development

The project is configured with tools and standards to ensure smooth collaboration and efficient development.

The project is configured to use TypeScript, with settings defined in `tsconfig.json`. It also uses ESLint and Prettier for code quality and formatting.

### Project Structure

```plaintext
src/
├── @types             # TypeScript definitions and type augmentations.
├── App.tsx            # Root React component.
├── assets             # Static assets like images, logos, and icons.
├── augment-types      # TypeScript type augmentation files.
├── components         # Modular and reusable UI components.
├── custom-derives     # Custom derived data from the Polkadot API.
├── dayjs.ts           # Configuration for the Day.js library.
├── hooks              # Custom React hooks for shared logic.
├── index.tsx          # Entry point for the React application.
├── pages              # Page components representing application routes.
├── plugins            # Configuration and setup for external libraries.
├── schemas            # GraphQL schemas and queries.
├── simple-staking     # Logic and components specific to the staking feature.
├── sleeve             # Custom Polkadot WASM crypto implementations.
├── theme              # Configuration for the Material-UI theme.
├── types.ts           # Application-wide TypeScript types.
└── utils              # General-purpose utility functions.
```

### Environment Variables

Environment variables are listed in the `.env-example` file. Here are the key variables:

```properties
REACT_APP_API_URL=wss://rpc.xx.network
REACT_APP_BACKEND_HOST=xxexplorer-prod.hasura.app
REACT_APP_WALLET_URL=https://wallet.xx.network
```

### Build Process

The project uses `react-app-rewired` for builds:

```bash
yarn build
```

Build artifacts are output to the `build/` folder.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bugfix (e.g., `feature/add-new-feature` or `bugfix/fix-issue`).
3. **Commit your changes** with descriptive messages.
4. **Push your branch** to your fork.
5. **Submit a pull request (PR)** with the following structure:
   - **Changes**: Summary of changes made.
   - **Reason**: Explanation of why these changes are necessary.
   - **Tag**: Choose from the following:
     - `bug`: Fixes a bug.
     - `feature`: Adds new functionality.
     - `improvement`: Enhances existing functionality.
     - `docs`: Documentation updates.
     - `test`: Adds or modifies tests.
     - `refactor`: Code restructuring without functional changes.
     - `chore`: Minor maintenance tasks.
     - `style`: Formatting changes with no code logic alterations.
     - `performance`: Performance optimizations.

### Guidelines

- Follow the repository's coding style.
- Write clear commit messages (e.g., "Fix: Resolved staking issue").
- Include relevant tests for your changes.
- Ensure no existing functionality is broken by your contributions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have questions, need support, or wish to discuss features, contact:  
📧 [devops@xx.network]