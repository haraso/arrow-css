import { ASTBlockNode, ASTEntryNode, ASTRootNode, ASTTextNode } from "./nodes";
import { TextObj } from "./utils/createTextObj";

export const plugins: Array<
  (data: { ast: ASTRootNode; className: string; textObj: TextObj }) => void
> = [];

export function plugin(
  plugin: (data: {
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
) {
  plugins.push(plugin);
}

export const blockPlugins: Array<
  (data: {
    blockNode: ASTBlockNode;
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
> = [];

export function blockPlugin(
  blockPlugin: (data: {
    blockNode: ASTBlockNode;
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
) {
  blockPlugins.push(blockPlugin);
}

export const entryPlugins: Array<
  (data: {
    entryNode: ASTEntryNode;
    blockNode: ASTBlockNode;
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
> = [];

export function entryPlugin(
  entryPlugin: (data: {
    entryNode: ASTEntryNode;
    blockNode: ASTBlockNode;
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
) {
  entryPlugins.push(entryPlugin);
}

export const wrapperPlugins: Array<
  (data: {
    wrapperNode: ASTTextNode;
    blockNode: ASTBlockNode;
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
> = [];

export function wrapperPlugin(
  plugin: (data: {
    wrapperNode: ASTTextNode;
    blockNode: ASTBlockNode;
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
) {
  wrapperPlugins.push(plugin);
}
