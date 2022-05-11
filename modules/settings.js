import { CONSTANTS } from "./shared/constants.js";

/** Debounce calls before reloading page */
const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 500);

/** Settings global names */
export const SETTINGS = {
  BOARD_ID: "board-id",
  DISPLAY_BOARD: "display-board",
  HIDE_HOTBAR: "hide-hotbar",
  ACCESS_TOKEN: "access-token",
  CORS_PROXY_URL: "cors-proxy-url",
  PLAYER_API_ACCESS: "player-api-access",
  SCENE_ID: "scene-id"
};

/** Register settings */
export function registerSettings() {
  // Board ID Setting
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.BOARD_ID}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.BOARD_ID}-hint`),
    scope: "world",
    config: true,
    default: "",
    type: String,
    onChange: () => debouncedReload()
  });

  // Display Miro board
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.DISPLAY_BOARD, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.DISPLAY_BOARD}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.DISPLAY_BOARD}-hint`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => debouncedReload()
  });

  // Hide hotbar
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.HIDE_HOTBAR, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.HIDE_HOTBAR}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.HIDE_HOTBAR}-hint`),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: () => debouncedReload()
  });

  // Miro Access token setting
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.ACCESS_TOKEN, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.ACCESS_TOKEN}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.ACCESS_TOKEN}-hint`),
    scope: "world",
    config: true,
    default: "",
    type: String,
    onChange: () => debouncedReload()
  });

  // Cors proxy URL
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.CORS_PROXY_URL, {
    name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.CORS_PROXY_URL}-name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.settings.${SETTINGS.CORS_PROXY_URL}-hint`),
    scope: "world",
    config: true,
    default: "",
    type: String,
    onChange: () => debouncedReload()
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
    onChange: () => debouncedReload()
  });

  // HIDDEN: used for storing the scene ID
  game.settings.register(CONSTANTS.MODULE_NAME, SETTINGS.SCENE_ID, {
    scope: "world",
    config: false,
    default: "",
    type: String
  });
}
