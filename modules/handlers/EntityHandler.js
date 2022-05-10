/** Basic handler */
export class EntityHandler {
  /** @type {string} the hook to fire */
  static hook = "";

  /** Kickstart the features of this class */
  static init() {
    this.registerHooks();
  }

  /** Register the necessary hooks */
  static registerHooks() {
    Hooks.on(this.hook, this.handler);
  }

  /**
   * The handler that will be fired
   * @param {...any} _args any args sent by the hook
   */
  static handler(..._args) {}
}
