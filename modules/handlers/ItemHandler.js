import { MiroAPI } from "../classes/MiroAPI.js";
import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";
import { choicesDialog } from "../shared/helpers.js";
import { EntityHandler } from "./EntityHandler.js";

/** Handle the sidebar items */
export class ItemHandler extends EntityHandler {
  /** @override */
  static hook = "getItemDirectoryEntryContext";

  /** @override */
  static handler(html, options) {
    options.push({
      name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
      icon: '<i class="fas fa-cloud-upload-alt"></i>',
      condition: () =>
        !(!game.user.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)),
      callback: (li) => {
        const item = game.items.get(li.data("documentId"));

        const choices = [];

        if (item.data.img !== window.foundry.data.ItemData.DEFAULT_ICON) {
          choices.push({
            id: `item-img`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-item-img`),
            callback: () => MiroAPI.sendActorItemImage(item.data.img)
          });

          choices.push({
            id: `item-img-name`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-item-img-name`),
            callback: () => MiroAPI.sendActorItemImageWithCaption(item.data.img, item.data.name)
          });
        }

        choices.push({
          id: `item-name`,
          icon: '<i class="fas fa-heading"></i> <i class="fas fa-plus"></i> <i class="fas fa-sticky-note"></i> <i class="fas fa-long-arrow-alt-right"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-item-name-sticky`),
          callback: () => MiroAPI.sendActorItemStickyNote(item.data.name)
        });

        choicesDialog({ buttons: choices });
      }
    });
  }
}
