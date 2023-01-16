"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios_1 = require("axios");
const fast_xml_parser_1 = require("fast-xml-parser");
async function activate(context) {
    const res = await axios_1.default.get("https://blog.webdevsimplified.com/rss.xml");
    const xmlParser = new fast_xml_parser_1.XMLParser();
    // console.log("res.data", xmlParser.parse(res.data));
    const articles = xmlParser
        .parse(res.data)
        .rss.channel.item.map((article) => {
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
    let disposable = vscode.commands.registerCommand("algoroot.searchWdsBlogExample", async () => {
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
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map