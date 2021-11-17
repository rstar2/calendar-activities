// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
    // **optional** default: `{}`
    // override vscode settings part
    // Notice: It only affects the settings used by Vetur.
    settings: {
      "vetur.useWorkspaceDependencies": true,
      "vetur.experimental.templateInterpolationService": true
    },
    // **optional** default: `[{ root: './' }]`
    // support monorepos
    projects: [
      {
        // **required**
        // Where is your project?
        // It is relative to `vetur.config.js`.
        root: './vue',
        // **optional**
        // Where is TypeScript config file in the project?
        // It is relative to root property.
        tsconfig: './jsconfig.json',
      }
    ]
  }