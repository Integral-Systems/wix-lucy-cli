# Lucy-CLI

<div style="float: right; margin: 0 0 30px 30px;">
  <img src="lucy.jpg" alt="Lucy-CLI" width="200" height="200" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

## Motivation

Lucy-CLI was developed out of a personal need to gain full TypeScript support for Wix Velo projects. Typically, using Wix's GitHub integration provides JSON docs and basic type support, but I aimed for a more integrated TypeScript experience, especially for larger projects that benefit from enhanced type safety.

Lucy, my loyal dog, accompanied me during long nights working on a major project where I developed this CLI. Her companionship and resilience inspired the name "Lucy-CLI."

## Important Notes Before Using Lucy-CLI

This CLI is still in development and may have bugs. Please use it with caution.

### Project Types Overview

Lucy-CLI supports multiple project types, each with different requirements and configurations:

#### Wix Velo Projects (`init velo`)
- **Purpose**: Full TypeScript support for Wix Velo development
- **Requirements**: 
  - Libraries must have the same folder structure as the main TypeScript folder (backend, public, styles)
  - Composite and declaration tsconfig settings must be set to false for type reexport
- **Limitations**: Opinionated structure - may not work with all projects

**Backend Endpoint Import Pattern:**
```javascript
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { initialize, InitResponse } from 'backend/lib/initialize.web';
```

#### Other Project Types
- **Expo** (`init expo`): React Native with Expo framework
- **Blocks** (`init blocks`): Wix Blocks development
- **Monorepo** (`init monorepo`): Nx-based monorepo setup
- **Tauri** (`init tauri`): Desktop applications with Tauri
- **Cargo** (`init cargo`): Rust projects
- **Wix SDK** (`init wix-sdk`): Wix SDK integration

### Template System

Lucy-CLI uses a centralized template system located at `~/.lucy-cli` (your home directory). This folder contains:
- Default project configurations
- File structure templates for each project type
- Customizable settings and configurations

## Contributing

Contributions are welcome! Please submit issues and pull requests, and I will merge them if they fit the project's goals.

## What It Does

Lucy-CLI is designed to streamline the setup and management of TypeScript within Wix Velo projects, providing tools to enhance code quality and reduce development time. Here's what it offers:

1.  **ESLint Configuration**
   - Adds ESLint with a default configuration (customizable post-init) to maintain consistent code style and prevent common errors.

2.  **Wix Type Definitions**
   - Exposes Wix type definitions located in `.wix/types/wix-code-types`, allowing direct import and access to the types for comprehensive TypeScript support.

3.  **Autocomplete and Type Mapping for Page Elements**
   - Maps Wix page elements to their respective types, so `$w('element')` calls have full TypeScript support, including autocomplete for properties and methods.

4.  **Git Submodule Support**
   - Includes support for git submodules, providing full type support within submodules and enabling the use of libraries and types across projects.
   - To add a submodule, include the following in the `lucy.json` file:

      ```json
      "modules": {
        "<repoName>": {
            "url": "String",
            "branch": "String",
            "path": "String", // Optional, specifies the path where the submodule should be cloned
            "noCompile": true // Optional, if true, the module will not be compiled
        }
      }
      ```

5.  **Configurable Setup**
   - After initialization, Lucy-CLI creates a `lucy-config.json` configuration file where you can modify settings, add dev packages, specify Wix packages, and configure git submodules.

6.  **Execute Render Functions**
   - Lucy-CLI can execute render functions located in the backend template folder, allowing you to test render functions locally.

7.  **Compile SCSS Files**
   - Lucy-CLI can compile SCSS files to CSS files.
   - It compiles the `styles/global.scss` file to `global.css`.

8.  **Wix NPM Package Installation**
   - Lucy-CLI can install Wix npm packages from the `lucy.json` file.

9.  **Testing with Vitest**
   - Lucy-CLI can run tests with Vitest.
   - It runs tests located in the backend folder with file names ending with `.spec.ts`.
   - It creates a code coverage report in the coverage folder in the lib folders and TypeScript folders.
   - Vitest looks for mocks in the TypeScript folder and lib folder.
     - You can add additional mock folders in the `vitest.config.ts` file.

10. **Linting with ESLint**
    - Lucy-CLI can lint the code with ESLint.
    - It uses the ESLint configuration in the `.eslintrc.cjs` file in the project directory.  

11. **Add Git Version During Production Build**
      - Lucy-CLI can add the git version to the production build.
      - It adds the git version to the `public/constant/env.ts` file in the public folder under the key `gitTag`.

12. **Use Velo-Sync to Synchronize Local Collections with Wix**
      - Lucy-CLI can synchronize local collections with Wix collections.
      - More information can be found in the [velo-sync](https://www.npmjs.com/package/velo-sync) documentation.

13. **Synchronize `package.json` with `lucy.json`**
    - Lucy-CLI can synchronize dependencies from your project's `package.json` directly into the `lucy.json` configuration. The `dependencies` are mapped to `wixPackages` and `devDependencies` are mapped to `devPackages`.

14. **Manage CLI Templates**
    - Lucy-CLI uses a templates folder (`~/.lucy-cli`) to store default configurations and file structures for the `init` command. Use the `open` command to access and customize these templates.

## Commands & Options

Lucy-CLI comes with a comprehensive set of commands and options. Use `lucy-cli -h` to see a complete overview of all available commands and options.

### Main Commands

- **`init <type>`**: Initialize a new Lucy project with the specified type
  - **Types**: `velo`, `expo`, `blocks`, `monorepo`, `tauri`, `cargo`, `wix-sdk`
- **`open`**: Open the Lucy home directory
- **`task <name>`**: Run a specific task
- **`wix-sync <action>`**: Run velo-sync actions
- **`wix-sdk <action>`**: Run Wix SDK actions

### Available Tasks

- **`dev`**: Start development environment
- **`build`**: Build the project
- **`build-prod`**: Build for production
- **`build-pipeline`**: Build pipeline
- **`sync-settings`**: Sync settings

### Wix Sync Actions

- **`sync`**: Synchronize collections
- **`import`**: Import data from CSV
- **`init`**: Initialize sync configuration
- **`is-alive`**: Check if sync is alive
- **`migrate`**: Migrate data
- **`export`**: Export data

### Project Types

- **`velo`**: Wix Velo project
- **`expo`**: React Native with Expo
- **`blocks`**: Wix Blocks
- **`monorepo`**: Monorepo setup
- **`tauri`**: Tauri desktop app
- **`cargo`**: Rust project
- **`wix-sdk`**: Wix SDK setup

### Global Options

- **`-h, --help`**: Show comprehensive help message with all commands and options
- **`-v, --version`**: Show version number
- **`-f, --force`**: Force execution (use with caution)

## Examples

Here are some example commands to get started with Lucy-CLI:

```bash
# Get comprehensive help overview
lucy-cli -h

# Initialize a new Wix Velo project
lucy-cli init velo

# Start the development environment
lucy-cli task dev

# Synchronize database and settings
lucy-cli task sync-settings

# Run velo-sync import with CSV file
lucy-cli wix-sync import -i data.csv -c myCollection

# Force start the dev environment
lucy-cli task dev -f

# Check Wix sync status
lucy-cli wix-sync is-alive
```

## Enhanced Help System

Lucy-CLI now provides a comprehensive help overview when you use the `-h` or `--help` flag. This includes:

- 📋 Complete list of all available commands
- 🔧 Available tasks with descriptions
- 🔄 Wix sync actions with explanations
- ⚙️ Global options and their usage
- 📁 Project types for initialization
- 🦮 Emoji-enhanced interface for better readability

The help system dynamically shows all available options based on your current configuration and provides clear examples for each command.

If you find Lucy-CLI useful, consider supporting the project:
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/gradlon)