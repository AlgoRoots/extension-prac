// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { stripVTControlCharacters } from "util";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
type NewArticleType = {
  label: ArticleIType["title"];
  detail: ArticleIType["description"];
  link: ArticleIType["link"];
};

type ArticleIType = {
  title: string;
  description: string;
  link: vscode.Uri;
};

export async function activate(context: vscode.ExtensionContext) {
  const res = await axios.get("https://blog.webdevsimplified.com/rss.xml");

  const xmlParser = new XMLParser();
  // console.log("res.data", xmlParser.parse(res.data));

  const articles: NewArticleType[] = xmlParser
    .parse(res.data)
    .rss.channel.item.map((article: ArticleIType) => {
      return {
        label: article.title,
        detail: article.description,
        link: article.link,
      };
    });
  console.log(articles);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "algoroot.searchWdsBlogExample",
    async () => {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });

      if (article === undefined) {
        return;
      }

      vscode.env.openExternal(article.link);

      console.log("article", article);
      // // The code you place here will be executed every time your command is executed
      // // Display a message box to the user
      // vscode.window.showInformationMessage(
      //   "Hello World from AlgoRoot!, 숭해 extension"
      // );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
