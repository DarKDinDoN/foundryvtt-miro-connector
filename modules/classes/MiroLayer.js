import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";

/** The Miro HTML Layer */
class _MiroLayer {
  constructor() {
    /** @type {HTMLElement} An internal reference to the HTML element this class renders */
    this.html = null;
  }

  /** Init the Miro Layer by creating a new DOM Element */
  init() {
    this.createIframe();
    this.hideUI();
  }

  /** @returns {string} the registered board id */
  get boardID() {
    return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID);
  }

  /** @returns {number} the current sidebar width */
  get sidebarWidth() {
    let sidebar = document.getElementById("ui-right");
    return sidebar.offsetWidth;
  }

  /**
   * Create an iframe with the board URL
   * @returns {HTMLElement} the created iframe
   */
  createIframe() {
    const width =
      (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) -
      this.sidebarWidth +
      5;

    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", `https://miro.com/app/live-embed/${this.boardID}/`);
    iframe.setAttribute("id", CONSTANTS.MODULE_NAME);
    iframe.setAttribute("frameBorder", "0");
    iframe.width = width;
    iframe.height = "100%";
    iframe.style.position = "absolute";
    iframe.style.left = 0;
    iframe.style.top = 0;
    iframe.frameborder = 0;

    this.html = iframe;

    const otherModules = document.querySelectorAll(
      "#fullscreen-layer, .gm-screen-app, #dice-box-canvas"
    );

    otherModules?.[0]
      ? document.body.insertBefore(this.html, otherModules[0])
      : document.body.insertBefore(this.html, document.getElementById("pause"));

    return this.html;
  }

  /** Hides some of the FVTT UI Components */
  hideUI() {
    document.getElementById("logo").style.visibility = "hidden";
    document.getElementById("controls").style.visibility = "hidden";
    document.getElementById("pause").style.visibility = "hidden";
  }
}

/** The singleton isntance holding the MiroLayer object */
export const MiroLayer = new _MiroLayer();
