import { MiroAPI } from "../classes/MiroAPI.js";
import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";
import { choicesDialog } from "../shared/helpers.js";
import { EntityHandler } from "./EntityHandler.js";

/** Handle the sidebar actors */
export class ActorHandler extends EntityHandler {
  /** @override */
  static hook = "getActorDirectoryEntryContext";

  /** @override */
  static condition() {
    return !(
      !game.user.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)
    );
  }

  /** @override */
  static callback(li) {
    const _li = li.get(0);
    const actor = game.actors.get(_li.dataset.documentId);
    this.showMiroApiOptions(actor);
  }

  /**
   * Show a set of options to send data to Miro for this actor
   * @param {Actor} actor the actor being handled
   */
  static showMiroApiOptions(actor) {
    const buttons = [];

    if (![null, undefined, window.foundry.documents.BaseActor.DEFAULT_ICON].includes(actor.img)) {
      buttons.push({
        id: `actor-img`,
        icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-actor-img`),
        callback: () => MiroAPI.sendActorItemImage(actor.img)
      });

      buttons.push({
        id: `actor-img-name`,
        icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
        label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-actor-img-name`),
        callback: () => MiroAPI.sendActorItemImageWithCaption(actor.img, actor.name)
      });
    }

    buttons.push({
      id: `actor-name`,
      icon: '<i class="fas fa-heading"></i> <i class="fas fa-plus"></i> <i class="fas fa-sticky-note"></i> <i class="fas fa-long-arrow-alt-right"></i>',
      label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-actor-name-sticky`),
      callback: () => MiroAPI.sendActorItemStickyNote(actor.name)
    });

    choicesDialog({ buttons });
  }
}
