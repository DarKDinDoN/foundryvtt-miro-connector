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
  static handler(html, options) {
    options.push({
      name: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.sidebar.send-to-miro`),
      icon: '<i class="fas fa-cloud-upload-alt"></i>',
      condition: () =>
        !(!game.user.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.PLAYER_API_ACCESS)),
      callback: (li) => {
        const actor = game.actors.get(li.data("documentId"));

        const choices = [];

        if (actor.data.img !== window.foundry.data.ActorData.DEFAULT_ICON) {
          choices.push({
            id: `actor-img`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-actor-img`),
            callback: () => MiroAPI.sendActorItemImage(actor.data.img)
          });

          choices.push({
            id: `actor-img-name`,
            icon: '<i class="fas fa-portrait"></i> <i class="fas fa-plus"></i><i class="fas fa-heading"></i> <i class="fas fa-long-arrow-alt-right"></i>',
            label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-actor-img-name`),
            callback: () => MiroAPI.sendActorItemImageWithCaption(actor.data.img, actor.data.name)
          });
        }

        choices.push({
          id: `actor-name`,
          icon: '<i class="fas fa-heading"></i> <i class="fas fa-plus"></i> <i class="fas fa-sticky-note"></i> <i class="fas fa-long-arrow-alt-right"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialog.send-actor-name-sticky`),
          callback: () => MiroAPI.sendActorItemStickyNote(actor.data.name)
        });

        choicesDialog({ buttons: choices });
      }
    });
  }
}
