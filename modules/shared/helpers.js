import CONSTANTS from "./constants.js";

/**
 * Preprend logged message with the module title
 * @param {string} msg Message to print
 * @returns {void}
 */
export const logger = (msg) => console.log(`${CONSTANTS.MODULE_TITLE} | ${msg}`);
