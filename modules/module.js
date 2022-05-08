import { MiroAPI } from "./classes/MiroAPI.js";
import { MiroLayer } from "./classes/MiroLayer.js";
import { SidebarHandler } from "./classes/SidebarHandler.js";
import { registerSettings, SETTINGS } from "./settings.js";
import { CONSTANTS } from "./shared/constants.js";
import { logger } from "./shared/helpers.js";

/** Starting point of the module */
class MiroConnector {
  /** Init all the proper components */
  static init() {
    logger("Initializing module");

    // Register settings
    registerSettings();

    // Mandatory settings
    const boardID = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID);
    if (!boardID) return;

    // Should the Miro board be displayed within Foundry VTT?
    const displayBoard = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DISPLAY_BOARD);
    if (displayBoard) MiroLayer.init();

    // Is the API Properly configured?
    const accessToken = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.ACCESS_TOKEN);
    const corsProxyUrl = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.CORS_PROXY_URL);
    if (!accessToken || !corsProxyUrl) return;
    SidebarHandler.init();

    // Make the Miro API public
    setProperty(window, `${CONSTANTS.MODULE_NAME}.MiroAPI`, MiroAPI);
  }
}

// Wait for the proper hook to fire
Hooks.once("libWrapper.Ready", MiroConnector.init);
