import { MiroAPI } from "../classes/MiroAPI.js";
import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";
import { choicesDialog } from "../shared/helpers.js";

/** Handle the sidebar context entries */
export class SidebarHandler {
  /** Kickstart the features of this class */
  static init() {
    this.registerHooks();
  }

  /** Register the necessary hooks */
  static registerHooks() {
    Hooks.on("getActorDirectoryEntryContext", this._getActorEntryContextOptions);
    Hooks.on("getItemDirectoryEntryContext", this._getItemEntryContextOptions);
    Hooks.on("getJournalDirectoryEntryContext", this._getJournalContextOptions);
  }

  /**
   * Change the context entries to add Miro API Features for Actors
   * @param {jQuery|HTMLElement} html the html sidebar element
   * @param {object[]} options the entry context options
   */
  static _getActorEntryContextOptions(html, options) {
    SidebarHandler._getActorItemEntryContextOptions("actor", options);
  }

  /**
   * Change the context entries to add Miro API Features for Items
   * @param {jQuery|HTMLElement} html the html sidebar element
   * @param {object[]} options the entry context options
   */
  static _getItemEntryContextOptions(html, options) {
    SidebarHandler._getActorItemEntryContextOptions("item", options);
  }

  /**
   * Generate new context options for items & actors
   * @param {string} objectType the FVTT entity type
   * @param {object[]} options the entry context options
   */
  static _getActorItemEntryContextOptions(objectType, options) {
    const objectTypePlural = `${objectType}s`;
    const entityType = objectType.charAt(0).toUpperCase() + objectType.slice(1);

    options.push({
      name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
      icon: '<i class="fas fa-cloud-upload-alt"></i>',
      condition: () =>
        !(!game.user.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)),
      callback: (li) => {
        const object = game[objectTypePlural].get(li.data("documentId"));

        const choices = [];

        if (object.data.img !== window.foundry.data[`${entityType}Data`].DEFAULT_ICON) {
          choices.push({
            id: `${objectType}-img`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-${objectType}-img`),
            callback: () => MiroAPI.sendActorItemImage(object.data.img)
          });

          choices.push({
            id: `${objectType}-img-name`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(
              `${CONSTANTS.MODULE_NAME}.dialog.send-${objectType}-img-name`
            ),
            callback: () => MiroAPI.sendActorItemImageWithCaption(object.data.img, object.data.name)
          });
        }

        choices.push({
          id: `${objectType}-name`,
          icon: '<i class="fas fa-heading"></i> <i class="fas fa-plus"></i> <i class="fas fa-sticky-note"></i> <i class="fas fa-long-arrow-alt-right"></i>',
          label: game.i18n.localize(
            `${CONSTANTS.MODULE_NAME}.dialog.send-${objectType}-name-sticky`
          ),
          callback: () => MiroAPI.sendActorItemStickyNote(object.data.name)
        });

        choicesDialog({ buttons: choices });
      }
    });
  }

  /**
   * Change the context entries to add Miro API Features for Journals
   * @param {jQuery|HTMLElement} html the html sidebar element
   * @param {object[]} options the entry context options
   */
  static _getJournalContextOptions(html, options) {
    options.push({
      name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
      icon: '<i class="fas fa-cloud-upload-alt"></i>',
      condition: (li) => {
        if (
          !game.user.isGM &&
          !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)
        )
          return false;

        const object = game.journal.get(li.data("documentId"));
        return object.data.content || object.data.img || object.data.flags?.pdfoundry?.PDFData?.url;
      },
      callback: (li) => {
        const object = game.journal.get(li.data("documentId"));

        const choices = [];

        if (object.data.img) {
          choices.push({
            id: `journal-img`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-img`),
            callback: () => MiroAPI.sendJournalImage(object.data.img)
          });

          choices.push({
            id: `journal-img-title`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-img-title`),
            callback: () => MiroAPI.sendJournalImageWithCaption(object.data.img, object.data.name)
          });
        }

        if (object.data.content) {
          choices.push({
            id: `journal-content`,
            icon: '<i class="fas fa-file-alt"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-content`),
            callback: () => MiroAPI.sendJournalTextContent(object.data.content)
          });
        }

        if (object.data.flags?.pdfoundry?.PDFData?.url) {
          choices.push({
            id: `journal-pdf`,
            icon: '<i class="fas fa-file-pdf"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-pdf`),
            callback: () => MiroAPI.sendJournalDocument(object.data.flags.pdfoundry.PDFData.url)
          });
        }

        choicesDialog({ buttons: choices });
      }
    });
  }
}
