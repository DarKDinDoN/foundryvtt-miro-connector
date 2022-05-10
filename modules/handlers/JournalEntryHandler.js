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
    return (
      journalEntry.data.content ||
      journalEntry.data.img ||
      journalEntry.data.flags?.pdfoundry?.PDFData?.url
    );
  }

  /** @override */
  static callback(li) {
    const _li = li.get(0);
    const journalEntry = game.journal.get(_li.dataset.documentId);
    this.showMiroApiOptions(journalEntry);
  }

  /**
   * Show a set of options to send data to Miro for this journal entry
   * @param {JournalEntry} journalEntry the journal entry being handled
   */
  static showMiroApiOptions(journalEntry) {
    const buttons = [];

    if (journalEntry.data.img) {
      buttons.push({
        id: `journal-entry-img`,
        icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-entry-img`),
        callback: () => MiroAPI.sendJournalEntryImage(journalEntry.data.img)
      });

      buttons.push({
        id: `journal-entry-img-title`,
        icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-entry-img-title`),
        callback: () =>
          MiroAPI.sendJournalEntryImageWithCaption(journalEntry.data.img, journalEntry.data.name)
      });
    }

    if (journalEntry.data.content) {
      buttons.push({
        id: `journal-entry-content`,
        icon: '<i class="fas fa-file-alt"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-entry-content`),
        callback: () => MiroAPI.sendJournalEntryTextContent(journalEntry.data.content)
      });
    }

    if (journalEntry.data.flags?.pdfoundry?.PDFData?.url) {
      buttons.push({
        id: `journal-entry-pdf`,
        icon: '<i class="fas fa-file-pdf"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-entry-pdf`),
        callback: () =>
          MiroAPI.sendJournalEntryDocument(journalEntry.data.flags.pdfoundry.PDFData.url)
      });
    }

    choicesDialog({ buttons });
  }
}
