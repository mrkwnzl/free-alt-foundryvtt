let originalOnAlt;

function _onAlt_Override(event, up, modifiers) {
  // Implementation replaced with no-op to avoid highlighting
}

function _handleKeys_Override(event, key, up) {
  // modifiers taken from _handleKeys
  const modifiers = { key: key };
  if (!this.hasFocus && key.toLowerCase() === "h") originalOnAlt.call(this, event, up, modifiers);
}

Hooks.on("init", function () {
  game.settings.register("free-alt", "set-world", {
    name: "Free Alt on World",
    hint: "This re-maps highlighting all tokens on the canvas from the Alt key to H on all connected clients, regardless of the client setting. Enabling this setting hides the Free Alt on Client setting.",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => location.reload(),
  });

  game.settings.register("free-alt", "free-alt", {
    name: "Free Alt on Client",
    hint: "This re-maps highlighting all tokens on the canvas from the Alt key to H on this client.",
    scope: "client",
    config: !game.settings.get("free-alt", "set-world"),
    default: false,
    type: Boolean,
    onChange: () => location.reload(),
  });

  // Override default Foundry function for sliders
  if (game.settings.get("free-alt", "free-alt") || game.settings.get("free-alt", "set-world")) {
    originalOnAlt = KeyboardManager.prototype._onAlt;
    KeyboardManager.prototype._onAlt = _onAlt_Override;
    const defaultHandleKeys = KeyboardManager.prototype._handleKeys;
    KeyboardManager.prototype._handleKeys = function (event, key, up) {
      const pressH = _handleKeys_Override.call(this, event, key, up);
      if (!pressH) defaultHandleKeys.call(this, event, key, up);
    }
  }
});
