import { SETTINGS } from "../settings.js";
import { CONSTANTS } from "../shared/constants.js";
import { toUrl } from "../shared/helpers.js";

/** The Miro API */
class _MiroAPI {
  /** @returns {string} the registered board id */
  get boardID() {
    return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID);
  }

  /** @returns {string} the registered access token */
  get accessToken() {
    return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.ACCESS_TOKEN);
  }

  /** @returns {string} the registered CORS proxy url */
  get corsProxyUrl() {
    const _corsProxyUrl = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.CORS_PROXY_URL);
    return _corsProxyUrl.endsWith("/") ? _corsProxyUrl : `${_corsProxyUrl}/`;
  }

  /**
   * Send an actor or item image, optionnaly with its caption
   * @param {string} img the image path
   * @param {string} [caption=""] optional caption
   * @param {boolean} [silent=false] notification setting
   */
  async sendActorItemImage(img, caption = "", silent = false) {
    const response = await this._sendImage(img, {
      geometry: { height: CONSTANTS.MIRO_API.ACTOR_ITEM_IMG_HEIGHT },
      silent
    });

    if (caption) {
      this._addCaption(caption, response);
    }
  }

  /**
   * Send an actor or item image with its caption
   * @param {string} img the image path
   * @param {string} caption caption
   */
  sendActorItemImageWithCaption(img, caption) {
    const silent = true;
    this.sendActorItemImage(img, caption, silent);
  }

  /**
   * Send the image or object name as a sticky note
   * @param {string} content the sticky note content
   */
  sendActorItemStickyNote(content) {
    const boldedContent = `<strong>${content}</strong>`;

    this._sendStickyNote(boldedContent, {
      shape: "rectangle",
      style: { textAlign: "center", textAlignVertical: "middle" },
      geometry: {
        width: CONSTANTS.MIRO_API.ACTOR_ITEM_NAME_WIDTH
      }
    });
  }

  /**
   * Send a journal image, optionnaly with its caption
   * @param {string} img the image path
   * @param {boolean} [silent=false] notification setting
   */
  sendJournalEntryImage(img, silent = false) {
    this._sendImage(img, {
      geometry: { width: CONSTANTS.MIRO_API.JOURNAL_ENTRY_DOC_WIDTH },
      silent
    });
  }

  /**
   * Send a journal image with its caption
   * @param {string} img the image path
   * @param {string} caption caption
   */
  sendJournalEntryImageWithCaption(img, caption) {
    const silent = true;
    this.sendJournalEntryImage(img, caption, silent);
  }

  /**
   * Send a journal text
   * @param {string} content the content to be sent
   * @param {string} title the title of the file
   * @param {boolean} [silent=false] notification setting
   */
  sendJournalEntryTextContent(content, title, silent = false) {
    this._sendDocumentAsBlob(content, {
      title,
      geometry: { width: CONSTANTS.MIRO_API.JOURNAL_ENTRY_DOC_WIDTH },
      silent
    });
  }

  /**
   * Send a journal document
   * @param {string} doc the document path
   * @param {boolean} [silent=false] notification setting
   */
  sendJournalEntryDocument(doc, silent = false) {
    this._sendDocument(doc, {
      geometry: { width: CONSTANTS.MIRO_API.JOURNAL_ENTRY_DOC_WIDTH },
      silent
    });
  }

  /**
   * Add a caption to an uploaded file
   * @param {string} caption file caption
   * @param {object} response json response from the previous call
   */
  _addCaption(caption, response) {
    const boldedCaption = `<strong>${caption}</strong>`;

    this._sendStickyNote(boldedCaption, {
      shape: "rectangle",
      style: { textAlign: "center", textAlignVertical: "middle" },
      position: { y: response.geometry.height / 2 + CONSTANTS.MIRO_API.ACTOR_ITEM_NAME_MARGIN_TOP },
      geometry: {
        width: CONSTANTS.MIRO_API.ACTOR_ITEM_NAME_WIDTH
      }
    });
  }

  /**
   * Send a document to Miro
   * @param {string} url the image url
   * @param {object} options the additional options
   * @param {string} [options.title=" "] document title (defaults to and empty space)
   * @param {object} [options.position={}] miro position object
   * @param {object} [options.geometry={}] miro's geomotry object
   * @param {boolean} [options.silent=false] notification setting
   * @returns {Promise<Response>} the API Response
   */
  async _sendDocument(url, { title = " ", position = {}, geometry = {}, silent = false } = {}) {
    if (!/^.+.(xls|xlsx|csv|ods|doc|docx|odt|rtf|ppt|pptx|odp|pdf)$/.test(url)) {
      ui.notifications.error(
        game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.unsupported-file-type`)
      );
      return;
    }

    return await this._post(
      { data: { url: toUrl(url), title }, position, geometry },
      "documents",
      silent
    );
  }

  /**
   * Send a document to Miro
   * @param {string} content the content to be sent
   * @param {object} options the additional options
   * @param {string} [options.title] document title (defaults to and empty space)
   * @param {object} [options.position={}] miro position object
   * @param {object} [options.geometry={}] miro's geomotry object
   * @param {boolean} [options.silent=false] notification setting
   * @returns {Promise<Response>} the API Response
   */
  async _sendDocumentAsBlob(content, { title, position = {}, geometry = {}, silent = false } = {}) {
    const container = document.createElement("div");
    container.innerHTML = content;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
      orientation: "p",
      unit: "px",
      format: [690, 730],
      putOnlyUsedFonts: true,
      hotfixes: ["px_scaling"]
    });

    doc.html(container, {
      callback: (doc) => {
        const blob = doc.output("blob");
        const fileTitle = `${title}.pdf`;

        this._postFormData(blob, fileTitle, { title, position, geometry }, "documents", silent);
      },
      x: 0,
      y: 0,
      margin: 20,
      autoPaging: "text",
      width: 650,
      windowWidth: 650
    });
  }

  /**
   * Send an image to Miro
   * @param {string} url the image url
   * @param {object} options the additional options
   * @param {string} [options.title=" "] image title (defaults to and empty space)
   * @param {object} [options.position={}] miro's position object
   * @param {object} [options.geometry={}] miro's geomotry object
   * @param {boolean} [options.silent=false] notification setting
   * @returns {Promise<Response>} the API Response
   */
  async _sendImage(url, { title = " ", position = {}, geometry = {}, silent = false } = {}) {
    if (!/^.+.(bmp|gif|svg|jpeg|jpg|png|psd|heic|heif)$/.test(url)) {
      ui.notifications.error(
        game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.unsupported-file-type`)
      );
      return;
    }

    return await this._post(
      { data: { url: toUrl(url), title }, position, geometry },
      "images",
      silent
    );
  }

  /**
   * Send a stylized text to Miro
   * @param {string} content the content to send
   * @param {object} [options={}] additional options
   * @param {object} [options.style={}] the style to apply to this content
   * @param {object} [options.position={}] miro's position object
   * @param {object} [options.geometry={}] miro's geomotry object
   * @param {boolean} [options.silent=false] notification setting
   * @returns {Promise<Response>} the API Response
   */
  async _sendText(content, { style = {}, position = {}, geometry = {}, silent = false } = {}) {
    return this._post({ data: { content }, style, position, geometry }, "texts", silent);
  }

  /**
   * Send a stylized sticky note to Miro
   * @param {string} content the content to send
   * @param {object} [options={}] additional options
   * @param {string} [options.shape="square"] a Miro sticky note shape
   * @param {object} [options.style={}] the style to apply to this content
   * @param {object} [options.position={}] miro's position object
   * @param {object} [options.geometry={}] miro's geomotry object
   * @param {boolean} [options.silent=false] notification setting
   * @returns {Promise<Response>} the API Response
   */
  async _sendStickyNote(
    content,
    { shape = "square", style = {}, position = {}, geometry = {}, silent = false } = {}
  ) {
    return this._post(
      { data: { content, shape }, style, position, geometry },
      "sticky_notes",
      silent
    );
  }

  /**
   * Send a stylized sticky note to Miro
   * @param {string} [content=""] the content to send
   * @param {object} [options={}] additional options
   * @param {string} [options.shape="rectangle"] a Miro sticky note shape
   * @param {object} [options.style={}] the style to apply to this content
   * @param {object} [options.position={}] miro's position object
   * @param {object} [options.geometry={}] miro's geomotry object
   * @param {boolean} [options.silent=false] notification setting
   * @returns {Promise} the API Response
   */
  async _sendShape(
    content = "",
    { shape = "rectangle", style = {}, position = {}, geometry = {}, silent = false } = {}
  ) {
    const escapedContent = content.replace(/<([a-z][a-z0-9]*)[^>]*?(\/?)>/gi, "<$1$2>");
    const chunks = escapedContent.match(/[\s\S]{1,5500}/g);

    chunks.forEach((chunk, index, arr) => {
      const _silent = silent || index !== arr.length - 1;

      const width = geometry.width || 0;
      const x = index * width;
      position = mergeObject(position, { x });

      if (arr.length > 1) chunk += `<p>&nbsp;</p><p>${index + 1}/${arr.length}</p>`;

      this._post({ data: { content: chunk, shape }, style, position, geometry }, "shapes", _silent);
    });
  }

  /**
   * Post data to Miro
   * @param {object} data the object holding the data to send to Miro
   * @param {string} type the file type (according to Miro's documentation)
   * @param {boolean} [silent=false] wether to display a success message or not
   * @returns {Promise<Response>} the response object wrapped inside a Promise
   */
  async _post(data, type, silent = false) {
    return fetch(`${this.corsProxyUrl}https://api.miro.com/v2/boards/${this.boardID}/${type}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`
      },
      body: JSON.stringify(mergeObject({ position: { x: 0, y: 0, origin: "center" } }, data))
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          if (!silent) {
            ui.notifications.info(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.success`));
          }
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .catch((error) => {
        ui.notifications.error(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.error`));
        console.error(error);
      });
  }

  /**
   * Post form data to Miro
   * @param {Blob} blob the file as blob
   * @param {string} blobTitle the file title
   * @param {object} data the object holding the data to send to Miro
   * @param {string} type the file type (according to Miro's documentation)
   * @param {boolean} [silent=false] wether to display a success message or not
   * @returns {Promise<Response>} the response object wrapped inside a Promise
   */
  async _postFormData(blob, blobTitle, data, type, silent = false) {
    const formData = new FormData();
    formData.append("resource", blob, blobTitle);
    formData.append(
      "data",
      JSON.stringify(mergeObject({ position: { x: 0, y: 0, origin: "center" } }, data))
    );

    return fetch(`${this.corsProxyUrl}https://api.miro.com/v2/boards/${this.boardID}/${type}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`
      },
      body: formData
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          if (!silent) {
            ui.notifications.info(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.success`));
          }
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .catch((error) => {
        ui.notifications.error(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.error`));
        console.error(error);
      });
  }

  /**
   * Update data to Miro object
   * @param {string} id the Miro object ID
   * @param {string} type the file type (according to Miro's documentation)
   * @param {object} data the object holding the data to send to Miro
   * @returns {Promise<Response>} the response object wrapped inside a Promise
   */
  async _update(id, type, data) {
    return fetch(
      `${this.corsProxyUrl}https://api.miro.com/v2/boards/${this.boardID}/${type}/${id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(mergeObject({ position: { x: 0, y: 0, origin: "center" } }, data))
      }
    )
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .catch((error) => {
        ui.notifications.error(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.error`));
        console.error(error);
      });
  }

  /**
   * Get a Miro object by id
   * @param {string} id the object id
   * @param {string} type the object type
   * @returns {Promise<Response>} the response object wrapped inside a Promise
   */
  async _get(id, type) {
    return fetch(
      `${this.corsProxyUrl}https://api.miro.com/v2/boards/${this.boardID}/${type}/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    )
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .catch((error) => {
        ui.notifications.error(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.api.error`));
        console.error(error);
      });
  }
}

/** The singleton instance holding the API object */
export const MiroAPI = new _MiroAPI();
