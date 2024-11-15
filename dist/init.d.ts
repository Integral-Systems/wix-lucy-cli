import { ModuleSettings, ProjectSettings } from './index.js';
/**
 * Init Lucy project
 * @param {string} cwd Current working directory
 * @param {string} packageRoot Package root directory
 * @returns {void}
 */
export declare function init(moduleSettings: ModuleSettings, projectSettings: ProjectSettings): Promise<void>;
