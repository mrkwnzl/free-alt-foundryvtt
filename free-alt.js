function _onAlt_Override(event, up, modifiers) {
  // Implementation replaced with no-op to avoid highlighting
}

function _handleKeys_Override(event, key, up) {
  if (this.hasFocus) return false;
  if (key.toLowerCase() === "h") _onKeyH(event, up);
}

function _onKeyH(event, up) {
  if ( !canvas?.ready ) return;
  event.preventDefault();

  // Highlight placeable objects on any layers which are visible
  for ( let layer of canvas.layers ) {
    if ( !layer.objects || !layer.interactiveChildren ) continue;
    for ( let o of layer.placeables ) {
      if ( !o.visible ) continue;
      if ( !o.can(game.user, "hover") ) return;
      if ( !up ) o._onHoverIn(event, {hoverOutOthers: false});
      else o._onHoverOut(event);
    }
  }
}

Hooks.on("init", function () {
  game.settings.register("free-alt", "free-alt", {
    name: "Re-Map Highlighting All Tokens to H",
    hint: "This re-maps highlighting all tokens on the canvas from the Alt key to H on this client.",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => location.reload(),
  });

  // Override default Foundry function for sliders
  if (game.settings.get("free-alt", "free-alt")) {
    KeyboardManager.prototype._onAlt = _onAlt_Override;
    const defaultHandleKeys = KeyboardManager.prototype._handleKeys;
    KeyboardManager.prototype._handleKeys = function(event, key, up) {
      const pressH = _handleKeys_Override.call(this, event, key, up);
      if (!pressH) defaultHandleKeys.call(this, event, key, up);
    }
  }
});
