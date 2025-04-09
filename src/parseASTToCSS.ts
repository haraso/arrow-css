import {
  builtInPluginClassResolve,
  builtInPluginWhiteSpace,
} from "./builtInPlugins";
import {
  ASTBlockNode,
  ASTEntryNode,
  ASTRootNode,
  ASTTextNode,
  NODE_TYPES,
} from "./nodes";
import { blockPlugins, entryPlugins, plugins, wrapperPlugins } from "./plugins";
import { createTextObj, TextObj } from "./utils/createTextObj";

function parseASTWrapperNode(
  wrapperNode: ASTTextNode,
  blockNode: ASTBlockNode,
  ast: ASTRootNode,
  className: string,
  textObj: TextObj
) {
  builtInPluginWhiteSpace(wrapperNode);
  wrapperPlugins.forEach((cb) =>
    cb({ wrapperNode, blockNode, ast, className, textObj })
  );
  builtInPluginClassResolve(wrapperNode, className);
  textObj.text += wrapperNode.text;
}

function parseASTEntryNode(
  entryNode: ASTEntryNode,
  blockNode: ASTBlockNode,
  ast: ASTRootNode,
  className: string,
  textObj: TextObj
) {
  builtInPluginWhiteSpace(entryNode.key);
  builtInPluginWhiteSpace(entryNode.value);
  entryPlugins.forEach((cb) =>
    cb({ entryNode, blockNode, ast, className, textObj })
  );
  textObj.text += `${entryNode.key.text}: ${entryNode.value.text};`;
}

function parseASTBlockNode(
  blockNode: ASTBlockNode,
  ast: ASTRootNode,
  className: string,
  textObj: TextObj
) {
  blockPlugins.forEach((cb) => cb({ ast, blockNode, className, textObj }));

  const wrapperTextObj = createTextObj("");
  textObj.push(wrapperTextObj);
  const blockOpenTextObj = createTextObj(" { ");
  textObj.push(blockOpenTextObj);
  const blockBodyTextObj = createTextObj("");
  textObj.push(blockBodyTextObj);
  const blockCloseTextObj = createTextObj(" } ");
  textObj.push(blockCloseTextObj);

  parseASTWrapperNode(
    blockNode.wrapper,
    blockNode,
    ast,
    className,
    wrapperTextObj
  );
  blockNode.children.forEach((node) => {
    if (node.type === NODE_TYPES.block) {
      parseASTBlockNode(node as ASTBlockNode, ast, className, blockBodyTextObj);
    } else if (node.type === NODE_TYPES.entry) {
      parseASTEntryNode(
        node as ASTEntryNode,
        blockNode,
        ast,
        className,
        blockBodyTextObj
      );
    }
  });
}

export function parseASTToCSS(ast: ASTRootNode, className: string) {
  const textObj = createTextObj("");
  plugins.forEach((cb) => cb({ ast, className, textObj }));
  ast.children.forEach((node) => {
    if (node.type === NODE_TYPES.block) {
      parseASTBlockNode(node as ASTBlockNode, ast, className, textObj);
    }
  });
  return textObj.fullText;
}
