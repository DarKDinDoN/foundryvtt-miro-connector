import { CONSTANTS } from "./constants.js";

/**
 * Preprend logged message with the module title
 * @param {string} msg Message to print
 */
export const logger = (msg) => {
  console.log(`${CONSTANTS.MODULE_TITLE} | ${msg}`);
};

/**
 * Wrap a property or a method with Libwrapper (libWrapper.WRAPPER).
 * @param {string} target Path to the target method or property
 * @param {Function} fn Callback function to execute
 * @returns {number} Unique numeric "target" identifier
 */
export const wrap = (target, fn) =>
  libWrapper.register(CONSTANTS.MODULE_NAME, target, fn, libWrapper.WRAPPER);

/**
 * Dialog with choices displayed as buttons
 * @param {object} options options to pass to the dialog
 * @param {object[]} options.buttons the buttons to display
 * @returns {Promise} the dialog promise
 */
export const choicesDialog = async ({ buttons }) => {
  return new Promise((resolve) => {
    const dialogButtons = {};

    buttons.forEach((b) => {
      dialogButtons[b.id] = {
        icon: b.icon || "",
        label: b.label || "",
        callback: (html) => {
          resolve(b.callback(html));
        }
      };
    });

    new Dialog(
      {
        title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.choose-option`),
        buttons: dialogButtons
      },
      {
        id: `${CONSTANTS.MODULE_NAME}-dialog`
      }
    ).render(true);
  });
};

/**
 * Create an URL if not already is
 * @param {string} string
 * @returns {string} newly formated string
 */
export const toUrl = (string) => {
  const isUrl = isValidHttpUrl(string);

  if (isUrl) return string;

  const origin = window.location.origin;
  return string.startsWith("/") ? `${origin}${string}` : `${origin}/${string}`;
};

/**
 * Valide if a string is an HTTP(S) URL
 * @param {string} string the url to validate
 * @returns {boolean} is url
 */
export const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
