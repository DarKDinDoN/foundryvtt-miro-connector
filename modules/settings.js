import { CONSTANTS } from "./shared/constants.js";

/** Settings global names */
export const SETTINGS = {
  DISPLAY_BOARD: "display-board",
  BOARD_ID: "board-id",
  ACCESS_TOKEN: "access-token",
  CORS_PROXY_URL: "cors-proxy-url",
  PLAYER_API_ACCESS: "player-api-access"
};

/**
 * Register settings
 */
export function registerSettings() {
  // Display Miro board
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.DISPLAY_BOARD, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.DISPLAY_BOARD}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.DISPLAY_BOARD}-hint`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => window.location.reload()
  });

  // Board ID Setting
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.BOARD_ID}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.BOARD_ID}-hint`),
    scope: "world",
    config: true,
    default: "",
    type: String,
    onChange: () => window.location.reload()
  });

  // Miro Access token setting
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.ACCESS_TOKEN, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.ACCESS_TOKEN}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.ACCESS_TOKEN}-hint`),
    scope: "world",
    config: true,
    default: "",
    type: String,
    onChange: () => window.location.reload()
  });

  // Cors proxy URL
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.CORS_PROXY_URL, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.CORS_PROXY_URL}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.CORS_PROXY_URL}-hint`),
    scope: "world",
    config: true,
    default: "",
    type: String,
    onChange: () => window.location.reload()
  });

  // Player API access
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS, {
    name: game.i18n.localize(
      `${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.PLAYER_API_ACCESS}-name`
    ),
    hint: game.i18n.localize(
      `${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.PLAYER_API_ACCESS}-hint`
    ),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => window.location.reload()
  });
}
