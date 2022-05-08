import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";
import { choicesDialog, wrap } from "../shared/helpers.js";
import { MiroAPI } from "./MiroAPI.js";

/** Handle the sidebar context entries */
export class SidebarHandler {
  /** Kickstart the features of this class */
  static init() {
    this.registerWrappers();
  }

  /** Register the necessary wrappers */
  static registerWrappers() {
    wrap("ActorDirectory.prototype._getEntryContextOptions", this._getActorEntryContextOptions);
    wrap("ItemDirectory.prototype._getEntryContextOptions", this._getItemEntryContextOptions);
    wrap("JournalDirectory.prototype._getEntryContextOptions", this._getJournalContextOptions);
  }

  /**
   * Change the context entries to add Miro API Features
   * @param {Function} wrapped The wrapped function
   * @param {...any} args The arguments bound to the wrapped function
   * @returns {object[]} The context entries
   */
  static _getActorEntryContextOptions(wrapped, ...args) {
    const options = wrapped(...args);

    const newOptions = SidebarHandler._getActorItemEntryContextOptions("actor");

    return options.concat(newOptions);
  }

  /**
   * Change the context entries to add Miro API Features
   * @param {Function} wrapped The wrapped function
   * @param {...any} args The arguments bound to the wrapped function
   * @returns {object[]} The context entries
   */
  static _getItemEntryContextOptions(wrapped, ...args) {
    const options = wrapped(...args);

    const newOptions = SidebarHandler._getActorItemEntryContextOptions("item");

    return options.concat(newOptions);
  }

  /**
   * Generate new context options for items & actors
   * @param {string} objectType the FVTT entity type
   * @returns {object[]} The context entries
   */
  static _getActorItemEntryContextOptions(objectType) {
    const objectTypePlural = `${objectType}s`;
    const entityType = objectType.charAt(0).toUpperCase() + objectType.slice(1);

    return [
      {
        name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
        icon: '<i class="fas fa-cloud-upload-alt"></i>',
        condition: () =>
          !(
            !game.user.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)
          ),
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
              callback: () =>
                MiroAPI.sendActorItemImageWithCaption(object.data.img, object.data.name)
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
      }
    ];
  }

  /**
   * Change the context entries to add Miro API Features
   * @param {Function} wrapped The wrapped function
   * @param {...any} args The arguments bound to the wrapped function
   * @returns {object[]} The context entries
   */
  static _getJournalContextOptions(wrapped, ...args) {
    const options = wrapped(...args);

    const newOptions = [
      {
        name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
        icon: '<i class="fas fa-cloud-upload-alt"></i>',
        condition: (li) => {
          if (
            !game.user.isGM &&
            !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)
          )
            return false;

          const object = game.journal.get(li.data("documentId"));
          return (
            object.data.content || object.data.img || object.data.flags?.pdfoundry?.PDFData?.url
          );
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
      }
    ];

    return options.concat(newOptions);
  }
}
