import { ActorHandler } from "../handlers/ActorHandler.js";
import { ItemHandler } from "../handlers/ItemHandler.js";
import { JournalEntryHandler } from "../handlers/JournalEntryHandler.js";
import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";

/** The Miro HTML Layer */
class _MiroLayer {
  constructor() {
    /** @type {HTMLElement} an internal reference to the HTML container element this class renders */
    this.html = null;

    /** @type {HTMLElement} an internal reference to the HTML iframe element this class renders */
    this.iframe = null;

    /** @type {string} the scene id for which to display the miro board */
    this.sceneID = null;
  }

  /** Init the Miro Layer by creating a new DOM Element */
  async init() {
    await this.findOrcreateScene();
    this.createHTMLContainer();
    this.activateListeners();
    this.registerHooks();
    this._toggleView(canvas);
  }

  /** @returns {string} the registered board id */
  get boardID() {
    return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID);
  }

  /** @returns {boolean} whether the hotbar should be hidden or not */
  get hideHotbar() {
    return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.HIDE_HOTBAR);
  }

  /** @type {number} the current sidebar width */
  get sidebarWidth() {
    const sidebar = document.getElementById("ui-right");
    return sidebar.offsetWidth;
  }

  /**
   * Get or create a scene that will hold the Miro view
   * @returns {void}
   */
  async findOrcreateScene() {
    const sceneID = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.SCENE_ID);
    let scene = game.scenes.get(sceneID);

    if (!scene) {
      if (!game.user.isGM)
        return ui.notification.error(
          game.i18n.localize(`${CONSTANTS.MODULE_NAME}.layer.gm-needed`)
        );

      scene = await Scene.create({
        name: CONSTANTS.MIRO_lAYER.DEFAULT_SCENE_NAME,
        tokenVision: false
      });
      await game.settings.set(CONSTANTS.MODULE_NAME, SETTINGS.SCENE_ID, scene.id);
    }

    this.sceneID = scene.id;
  }

  /**
   * Create an iframe with the board URL
   */
  createHTMLContainer() {
    // HTML Container
    const container = document.createElement("div");
    container.setAttribute("id", CONSTANTS.MODULE_NAME);
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.position = "absolute";
    container.style.left = 0;
    container.style.top = 0;
    container.style.display = "none";

    // Iframe
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", `https://miro.com/app/live-embed/${this.boardID}/`);
    iframe.setAttribute("frameBorder", "0");
    iframe.style.width = `calc(100% - ${this.sidebarWidth}px)`;
    iframe.height = "100%";
    iframe.frameborder = 0;

    // Adding container + iframe to the main HTML
    container.appendChild(iframe);
    this.html = container;
    this.iframe = iframe;

    const otherModules = document.querySelectorAll(
      "#fullscreen-layer, .gm-screen-app, #dice-box-canvas"
    );

    otherModules?.[0]
      ? document.body.insertBefore(this.html, otherModules[0])
      : document.body.insertBefore(this.html, document.getElementById("pause"));
  }

  /** Add event listeners to the HTML */
  activateListeners() {
    this.html.addEventListener("drop", (event) => {
      let dragData;

      try {
        dragData = JSON.parse(event.dataTransfer.getData("text/plain"));
      } catch (err) {
        dragData = {};
      }

      if (Object.prototype.hasOwnProperty.call(dragData, CONSTANTS.MODULE_NAME)) {
        const object = game[dragData[CONSTANTS.MODULE_NAME].type].get(
          dragData[CONSTANTS.MODULE_NAME].documentId
        );

        switch (true) {
          case dragData[CONSTANTS.MODULE_NAME].type === "actors":
            ActorHandler.showMiroApiOptions(object);
            break;

          case dragData[CONSTANTS.MODULE_NAME].type === "items":
            ItemHandler.showMiroApiOptions(object);
            break;

          case dragData[CONSTANTS.MODULE_NAME].type === "journal":
            JournalEntryHandler.showPagesOptions(object);
            break;
        }
      }
    });
  }

  /** Register the necessary hooks */
  registerHooks() {
    Hooks.on("collapseSidebar", this._updateiFrameDimensions.bind(this));
    Hooks.on("canvasReady", this._toggleView.bind(this));
  }

  /** Update the iFrame width */
  _updateiFrameDimensions() {
    this.iframe.style.width = `calc(100% - ${this.sidebarWidth}px)`;
  }

  /**
   * Toggle the Miro board view
   * @param {Canvas} canvas the canvas being displayed
   */
  _toggleView(canvas) {
    if (canvas?.scene?.id === this.sceneID) {
      this._enable();
    } else {
      this._disable();
    }
  }

  /** Enable container and hides some of the FVTT UI Components */
  _enable() {
    this.html.style.display = "block";
    document.getElementById("ui-left").style.visibility = "hidden";
    document.getElementById("pause").style.visibility = "hidden";
    document.getElementById("board").style.display = "none";

    if (this.hideHotbar) document.getElementById("ui-bottom").style.visibility = "hidden";
  }

  /** Disable container and restore the FVTT UI Components */
  _disable() {
    this.html.style.display = "none";
    document.getElementById("ui-left").style.visibility = "visible";
    document.getElementById("pause").style.visibility = "visible";
    document.getElementById("board").style.display = "block";

    if (this.hideHotbar) document.getElementById("ui-bottom").style.visibility = "visible";
  }

  /** Will toggle the iframe event pointers */
  togglePointerEvents() {
    this.iframe.style.pointerEvents = ["", "auto", null, undefined].includes(
      this.iframe.style.pointerEvents
    )
      ? "none"
      : "auto";
  }
}

/** The singleton isntance holding the MiroLayer object */
export const MiroLayer = new _MiroLayer();
