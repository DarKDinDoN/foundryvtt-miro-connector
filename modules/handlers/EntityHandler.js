import { MiroLayer } from "../classes/MiroLayer.js";
import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";

/** Basic handler */
export class EntityHandler {
  /** @type {string} the hook to fire */
  static hook = "";

  /** Kickstart the features of this class */
  static init() {
    this.registerHooks();
  }

  /** Register the necessary hooks */
  static registerHooks() {
    Hooks.on(this.hook, this.handler.bind(this));
  }

  /**
   * The handler that will be fired
   * @param {jQuery|HTMLElement} html the html
   * @param {object[]} options the context entries options
   */
  static handler(html, options) {
    this.activateListeners(html);
    this.addOptions(options);
  }

  /**
   * Add event listeners to the HTML
   * @param {jQuery|HTMLElement} html the html
   */
  static activateListeners(html) {
    const displayBoard = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DISPLAY_BOARD);
    if (!displayBoard) return;

    const _html = html.get(0);
    const items = _html.getElementsByClassName("directory-item");

    for (const item of items) {
      const isFolder = item.classList.contains("folder");
      if (isFolder) continue;

      // Forced to use jQuery
      if (!this.condition($(item))) continue;

      item.setAttribute("draggable", true);

      item.addEventListener("dragstart", (event) => {
        MiroLayer.togglePointerEvents();

        let dragData;

        try {
          dragData = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (err) {
          dragData = {};
        }

        dragData[CONSTANTS.MODULE_NAME] = {
          type: _html.dataset.tab,
          documentId: item.dataset.documentId
        };

        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
      });
      item.addEventListener("dragend", () => MiroLayer.togglePointerEvents());
    }
  }

  /**
   * Add entries to the context entries option
   * @param {object[]} options the context entries options
   */
  static addOptions(options) {
    options.push({
      name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
      icon: '<i class="fas fa-cloud-upload-alt"></i>',
      condition: this.condition.bind(this),
      callback: this.callback.bind(this)
    });
  }

  /**
   * Condition to display new buttons
   * @param {jQuery|HTMLElement} _li the li element
   */
  static condition(_li) {}

  /**
   * New button actions
   * @param {jQuery|HTMLElement} _li the li element
   */
  static callback(_li) {}
}
