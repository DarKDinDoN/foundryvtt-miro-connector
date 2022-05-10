import { MiroAPI } from "../classes/MiroAPI.js";
import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";
import { choicesDialog } from "../shared/helpers.js";
import { EntityHandler } from "./EntityHandler.js";

/** Handle the sidebar journal notes */
export class JournalNoteHandler extends EntityHandler {
  /** @override */
  static hook = "getJournalDirectoryEntryContext";

  /** @override */
  static handler(html, options) {
    options.push({
      name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
      icon: '<i class="fas fa-cloud-upload-alt"></i>',
      condition: (li) => {
        if (
          !game.user.isGM &&
          !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)
        )
          return false;

        const journalNote = game.journal.get(li.data("documentId"));
        return (
          journalNote.data.content ||
          journalNote.data.img ||
          journalNote.data.flags?.pdfoundry?.PDFData?.url
        );
      },
      callback: (li) => {
        const journalNote = game.journal.get(li.data("documentId"));

        const choices = [];

        if (journalNote.data.img) {
          choices.push({
            id: `journal-note-img`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-note-img`),
            callback: () => MiroAPI.sendJournalNoteImage(journalNote.data.img)
          });

          choices.push({
            id: `journal-note-img-title`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(
              `${CONSTANTS.MODULE_NAME}.dialog.send-journal-note-img-title`
            ),
            callback: () =>
              MiroAPI.sendJournalNoteImageWithCaption(journalNote.data.img, journalNote.data.name)
          });
        }

        if (journalNote.data.content) {
          choices.push({
            id: `journal-note-content`,
            icon: '<i class="fas fa-file-alt"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-note-content`),
            callback: () => MiroAPI.sendJournalNoteTextContent(journalNote.data.content)
          });
        }

        if (journalNote.data.flags?.pdfoundry?.PDFData?.url) {
          choices.push({
            id: `journal-note-pdf`,
            icon: '<i class="fas fa-file-pdf"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-journal-note-pdf`),
            callback: () =>
              MiroAPI.sendJournalNoteDocument(journalNote.data.flags.pdfoundry.PDFData.url)
          });
        }

        choicesDialog({ buttons: choices });
      }
    });
  }
}
