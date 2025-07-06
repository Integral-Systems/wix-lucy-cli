# Lucy-CLI

![Lucy-CLI](lucy.jpg)

## Motivation

Lucy-CLI was developed out of a personal need to gain full TypeScript support for Wix Velo projects. Typically, using Wix’s GitHub integration provides JSON docs and basic type support, but I aimed for a more integrated TypeScript experience, especially for larger projects that benefit from enhanced type safety.

Lucy, my loyal dog, accompanied me during long nights working on a major project where I developed this CLI. Her companionship and resilience inspired the name "Lucy-CLI."

## CAUTION: Thing to keep in mind before using Lucy-CLI

This CLI is still in development and may have bugs. Please use it with caution.
Libraries are expected to have the same folder structure as  the main typescript folder except for the pages folder.
(backend, public, styles)
The lucy CLI is opinionated and may not work with all projects.

Yarn: Lucy-CLI is designed to work with yarn. It may not work with npm.
Make sure you have yarn installed on your machine and it is set to version 3.

```bash
yarn set <version> 
```

The composite and declaration tsconfig setting int need to be set to false in order to reexport types from the lib folder.
This is not ideal but it is a limitation of the current version of the CLI.

Importing backend endpoint into the frontend
Please be aware that the backend endpoint should be imported with the following code:

``` javascript
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { initialize, InitResponse } from 'backend/lib/initialize.web';
```

## Contributing

Contribution are welcome, issue and pull request and I will merge it if i see it fit.

## What It Does

Lucy-CLI is designed to streamline the setup and management of TypeScript within Wix Velo projects, providing tools to enhance code quality and reduce development time. Here’s what it offers:

1.  **ESLint Configuration**
   - Adds ESLint with a default configuration (customizable post-init) to maintain consistent code style and prevent common errors.

2.  **Wix Type Definitions**
   - Exposes Wix type definitions located in `.wix/types/wix-code-types`, allowing direct import and access to the types for comprehensive TypeScript support.

3.  **Autocomplete and Type Mapping for Page Elements**
   - Maps Wix page elements to their respective types, so `$w('element')` calls have full TypeScript support, including autocomplete for properties and methods.

4.  **Git Submodule Support**
   - Includes support for git submodules, providing full type support within submodules and enabling the use of libraries and types across projects.
   - To add a submodule, include the following in the `lucy.json` file:

      ``` json
      "modules": {
        "<repoName>": {
          "url": "String",
          "branch": "String"
        }
      }
      ```

5.  **Configurable Setup**
   - After initialization, Lucy-CLI creates a `lucy-config.json` configuration file where you can modify settings, add dev packages, specify Wix packages, and configure git submodules.

6.  **Execute render functions**
   - Lucy-CLI can execute render functions located in the backend template folder, allowing you to test render functions locally.

-7.  **Compile SCSS files**
   - Lucy-CLI can compile SCSS files to CSS files.
   - It compiles styles/global.scss file to global.css.

8.  **Wix NPM Package Installation**
   - Lucy-CLI can install Wix npm packages from the `lucy.json` file.

-9.  **Testing with Vitest**
   - Lucy-CLI can run tests with Vitest.
   - It runs tests located backend folder with the file name ending with `.spec.ts`.
   - it creates a code coverage report in the coverage folder in the lib folders and typescript folders.
   - Vitest is looking for mokes in typescript folder and lib folder.
     - You can add additional mock folders in vitest.config.ts file.

10. **Linting with ESLint**
    - Lucy-CLI can lint the code with ESLint.
    - It uses the ESLint configuration in the `.eslintrc.cjs` file in the project directory.  

11. **Add git version during production build**
      - Lucy-CLI can add the git version to the production build.
      - It adds the git version to the `public/constant/env.ts` file in the public folder under the key gitTag.
12. **Use velo-sync to synchronize local collection with wix**
      - Lucy-CLI can synchronize the local collection with the wix collection.
      - More information can be found in the [velo-sync](https://www.npmjs.com/package/velo-sync) documentation.

13. **Synchronize `package.json` with `lucy.json`**
    -   Lucy-CLI can synchronize dependencies from your project's `package.json` directly into the `lucy.json` configuration. The `dependencies` are mapped to `wixPackages` and `devDependencies` are mapped to `devPackages`.

14. **Manage CLI Templates**
    -   Lucy-CLI uses a templates folder (`~/.lucy-cli`) to store default configurations and file structures for the `init` command. The `templates` command allows you to easily open and customize these templates.

## Commands & Options

Lucy-CLI comes with a range of commands and options to help manage your Wix Velo project. Here’s an overview:

### Commands

- **`init`**: Initializes the current folder as a Wix project, creating essential configuration files.
- **`dev`**: Starts the development environment, including setting up any required services for local development.
- **`build-prod`**: Builds the project in production mode, optimizing files for deployment.
- **`prepare`**: Re-runs initialization commands, useful for setting up a pre-configured environment.
- **`velo-sync`**: Synchronizes Wix collections.
- **`install`**: Installs all Wix and dev npm packages listed in the `lucy.json` file.
- **`fix`**: Runs a fix command to resolve common issues in development or production settings.
- **`docs`**: Generates documentation for the project.
- **`cypress`**: Starts the Cypress test runner.
- **`templates`**: Opens the Lucy CLI templates folder.
- **`sync-pkgs`**: Synchronizes dependencies from `package.json` to `lucy.json`.
- **🦮 `e2e`**: Starts the Cypress test runner in CI mode.  
  **Usage:** `e2e <someKey> <someID>`  
  - **`someKey`**: The key for the test.  
  - **`someID`**: The build ID for the test.

### Options

- **`-h, help`**: Displays the help message with command descriptions.
- **`-v, version`**: Shows the current version of Lucy-CLI as defined in the project’s `package.json`.
- **`-f, force`**: Forces specific commands to execute, useful for deleting obsolete pages or initializing missing components.
- **`-l`**: Locks package versions to those specified in the configuration file during installation.

## Examples

Here are some example commands to get started with Lucy-CLI:

```bash
# Initialize a new Wix project
lucy-cli init

# Start the development environment
lucy-cli dev

# Synchronize database and settings
lucy-cli sync

# Install Wix npm packages from 'lucy.json' with locked versions
lucy-cli install -l

# Force start the dev environment
lucy-cli dev -f

# get help
lucy-cli help

🦮 Lucy CLI Help
Usage: lucy-cli <command> [options]

Commands:
🦮 init               : Initializes a WIX project to enable full TS support.
🦮 dev                : Starts the development environment. This includes setting up any required services for local development.
🦮 build-prod         : Builds the project in production mode, optimizing files for deployment.
🦮 prepare            : Prepares the project by installing packages & initializing git modules, configured in lucy.json.
🦮 velo-sync          : Synchronizes Wix collections (run `velo-sync -h` for help).
🦮 install            : Installs all Wix and dev npm packages listed in the 'lucy.json' file.
🦮 fix                : Runs a fix command to resolve common issues in development or production settings.
🦮 docs               : Generates documentation for the project.
🦮 cypress            : Starts the cypress test runner.
🦮 templates          : Opens the Lucy CLI templates folder.
🦮 sync-pkgs          : Syncs dependencies from package.json to lucy.json.
🦮 e2e                : Starts the cypress test runner in CI mode. Usage: `e2e <key> <buildId>`

Options:
🦮 -h, help           : Displays this help message.
🦮 -v, version        : Displays the current version of Lucy CLI as defined in the project’s package.json.
🦮 -f, force          : Forces specific commands to execute even if they may lead to potential issues.
                      Used for functions like deleting obsolete pages or initializing missing components.
🦮 -l                 : Locks package versions to those specified in `lucy.json` during installation.

Examples:
🦮 lucy-cli init       : Initializes a new Wix project.
🦮 lucy-cli dev        : Starts the development environment.
🦮 lucy-cli sync       : Synchronizes database and settings.
🦮 lucy-cli install    : Installs all Wix and dev npm packages from 'lucy.json'.
🦮 lucy-cli dev -f     : Starts the dev environment with forced settings.
🦮 lucy-cli install -l : Installs Wix npm packages, respecting locked versions specified in the configuration.
```

If you find Lucy-CLI useful, consider supporting the project:
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/gradlon)