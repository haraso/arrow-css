import { ASTTextNode } from "./nodes";
import { escapeClassName } from "./utils/escapeClassName";

export function builtInPluginClassResolve(
  textNode: ASTTextNode,
  className: string
) {
  if (!textNode.text.includes("class")) return;
  textNode.text = textNode.text.replace(
    /class/g,
    `.${escapeClassName(className)}`
  );
}

export function builtInPluginWhiteSpace(textNode: ASTTextNode) {
  if (!textNode.text.includes("_")) return;
  textNode.text = textNode.text.replace(/_/g, " ");
}
