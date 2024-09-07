import { _createElement, _fragment, type Renderable } from "simple-jsx-handler";

export const InfoTooltip: Renderable = (attrs, ...children) => {
  if (children.length !== 1) {
    throw new Error("Invalid children count");
  }

  if (typeof children[0] !== "string") {
    throw new Error("Invalid children type");
  }

  const tooltipText = children[0] ?? "";
  const position = attrs.position ?? "top";

  if (position !== "top" && position !== "bottom" && position !== "left" && position !== "right") {
    throw new Error("Invalid position");
  }

  return <>
    <br />
    <span class="text-error">{ tooltipText }</span>
  </>;
};
