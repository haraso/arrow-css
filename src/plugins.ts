import { ASTBlockNode, ASTEntryNode, ASTRootNode, ASTTextNode } from "./nodes";
import { TextObj } from "./utils/createTextObj";

export const plugins: Array<
  (data: { ast: ASTRootNode; className: string; textObj: TextObj }) => void
> = [];

export type Plugin = (data: {
  ast: ASTRootNode;
  className: string;
  textObj: TextObj;
}) => void;

export function plugin(plugin: Plugin) {
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

export type BlockPlugin = (data: {
  blockNode: ASTBlockNode;
  ast: ASTRootNode;
  className: string;
  textObj: TextObj;
}) => void;

export function blockPlugin(blockPlugin: BlockPlugin) {
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

export type EntryPlugin = (data: {
  entryNode: ASTEntryNode;
  blockNode: ASTBlockNode;
  ast: ASTRootNode;
  className: string;
  textObj: TextObj;
}) => void;

export function entryPlugin(entryPlugin: EntryPlugin) {
  entryPlugins.push(entryPlugin);
}

function entryKeyShortenersMaker(shorteners: Record<string, string>) {
  return ({ entryNode }: any) => {
    const fullText = shorteners[entryNode.key.text];
    if (!fullText) return;
    entryNode.key.text = fullText;
  };
}

entryPlugin.entryKeyShorteners = (shorteners: Record<string, string>) =>
  entryPlugin(entryKeyShortenersMaker(shorteners));

function entryShortenersMaker(
  shorteners: Record<string, [key: string, value: string]>
) {
  return ({ entryNode }: any) => {
    const fullTextObj = shorteners[entryNode.key.text];
    if (!fullTextObj || entryNode.value.text) return;
    entryNode.key.text = fullTextObj[0];
    entryNode.value.text = fullTextObj[1];
  };
}

entryPlugin.entryShorteners = (
  shorteners: Record<string, [key: string, value: string]>
) => entryPlugin(entryShortenersMaker(shorteners));

export const wrapperPlugins: Array<
  (data: {
    wrapperNode: ASTTextNode;
    blockNode: ASTBlockNode;
    ast: ASTRootNode;
    className: string;
    textObj: TextObj;
  }) => void
> = [];

export type WrapperPlugin = (data: {
  wrapperNode: ASTTextNode;
  blockNode: ASTBlockNode;
  ast: ASTRootNode;
  className: string;
  textObj: TextObj;
}) => void;

export function wrapperPlugin(plugin: WrapperPlugin) {
  wrapperPlugins.push(plugin);
}
