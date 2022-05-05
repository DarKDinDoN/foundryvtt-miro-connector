import { logger } from "./shared/helpers.js";

/** Starting point of the module */
class MiroConnector {
  /** Init all the proper classes */
  static init() {
    logger("Initializing module");
  }
}

// Wait for the proper Hook to fire
Hooks.once("ready", MiroConnector.init);
