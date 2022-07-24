//import { MiroAPI } from "../classes/MiroAPI.js";
import { MiroAPI } from "../classes/MiroAPI.js";
import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";
import { choicesDialog } from "../shared/helpers.js";
import { EntityHandler } from "./EntityHandler.js";

/** Handle the sidebar journal entries */
export class JournalEntryHandler extends EntityHandler {
  /** @override */
  static hook = "getJournalDirectoryEntryContext";

  /** @override */
  static condition(li) {
    if (!game.user.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS))
      return false;

    const _li = li.get(0);
    const journalEntry = game.journal.get(_li.dataset.documentId);
    const pages = this._getContentPages(journalEntry);

    return pages.length > 0;
  }

  /** @override */
  static callback(li) {
    const _li = li.get(0);
    const journalEntry = game.journal.get(_li.dataset.documentId);
    this.showPagesOptions(journalEntry);
  }

  /**
   * Show the available pages to be sent to Miro
   * @param {JournalEntry} journalEntry the journal entry being handled
   */
  static showPagesOptions(journalEntry) {
    const pages = this._getContentPages(journalEntry);

    if (pages.length > 1) {
      const buttons = [];

      for (const page of pages) {
        buttons.push({
          id: `journal-page-${page.id}`,
          label: `<b>${journalEntry.pages.toObject().findIndex((p) => p._id === page.id)}.</b> ${
            page.name
          }`,
          callback: () => this.sendThroughMiroApi(page)
        });
      }

      buttons.push({
        id: `journal-page-all`,
        label: `<b>${game.i18n.localize(
          `${CONSTANTS.MODULE_NAME}.dialog.send-journal-all-pages`
        )}</b>`,
        callback: () => {
          for (const [index, page] of pages.entries()) {
            const silent = index !== pages.length - 1;
            this.sendThroughMiroApi(page, silent);
          }
        }
      });

      choicesDialog({ buttons });
    } else {
      this.sendThroughMiroApi(pages[0]);
    }
  }

  /**
   * Send data to Miro depending on page type
   * @param {JournalEntryPage} page the journal page being handled
   * @param {boolean} [silent=false] notification setting
   */
  static sendThroughMiroApi(page, silent = false) {
    switch (page.type) {
      case "text":
        MiroAPI.sendJournalEntryTextContent(page.text.content, silent);
        break;
      case "image":
        MiroAPI.sendJournalEntryImage(page.src, silent);
        break;
      case "pdf":
        MiroAPI.sendJournalEntryDocument(page.src, silent);
        break;
    }
  }

  /**
   * Filter the pages of a journal entry
   * @param {journalEntry} journalEntry the journal entry being filtered
   * @returns {Array} the filtered array of pages that holds content we can work with
   */
  static _getContentPages(journalEntry) {
    return journalEntry.pages.filter((page) => {
      return (
        page.type !== "video" &&
        ((page.type === "text" && page.text?.content) ||
          (page.type === "image" && page.src) ||
          (page.type === "pdf" && page.src))
      );
    });
  }
}
