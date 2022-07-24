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
  static condition() {
    return !(
      !game.user.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)
    );
  }

  /** @override */
  static callback(li) {
    const _li = li.get(0);
    const item = game.items.get(_li.dataset.documentId);
    this.showMiroApiOptions(item);
  }

  /**
   * Show a set of options to send data to Miro for this item
   * @param {Item} item the item being handled
   */
  static showMiroApiOptions(item) {
    const buttons = [];

    if (![null, undefined, window.foundry.documents.BaseItem.DEFAULT_ICON].includes(item.img)) {
      buttons.push({
        id: `item-img`,
        icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-item-img`),
        callback: () => MiroAPI.sendActorItemImage(item.img)
      });

      buttons.push({
        id: `item-img-name`,
        icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-item-img-name`),
        callback: () => MiroAPI.sendActorItemImageWithCaption(item.img, item.name)
      });
    }

    buttons.push({
      id: `item-name`,
      icon: '<i class="fas fa-heading"></i> <i class="fas fa-plus"></i> <i class="fas fa-sticky-note"></i> <i class="fas fa-long-arrow-alt-right"></i>',
      label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-item-name-sticky`),
      callback: () => MiroAPI.sendActorItemStickyNote(item.name)
    });

    choicesDialog({ buttons });
  }
}
