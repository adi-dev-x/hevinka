import { createElement } from "react";
import { ICON_NODES } from "./icon-sprite-data";

/** Server-rendered <symbol> sprite for <Icon/> (rendered once in the root layout; never shipped as JS). */
export function IconSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute size-0 overflow-hidden">
      {Object.entries(ICON_NODES).map(([name, nodes]) => (
        <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">
          {nodes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
        </symbol>
      ))}
    </svg>
  );
}
