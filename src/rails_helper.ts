import * as vscode from 'vscode';
import { join } from 'path';

//import * as inf from 'inflection';
var inflection = require('inflection');

export class RailsHelper {
    private fileName: String;
    private filePath: String;
    private modelName: String;
    private patterns: { label: string, description: string }[];

    public constructor(filePath: string, fileName: String) {
        this.fileName = fileName;
        this.filePath = join(filePath, "/");
        const modelItem = {
            label: "Model",
            description: "app/models/**/SINGULARIZE.rb"
        };
        const adminAPIItem = {
            label: "AdminAPI",
            description: "app/services/admin_api/**/PTN.rb"
        };
        const adminAPIEntityItem = {
            label: "AdminAPI Entity",
            description: "app/services/admin_api/entities/**/SINGULARIZE.rb"
        };
        const appAPIItem = {
            label: "AppAPI",
            description: "app/services/app_api/**/PTN.rb"
        };
        const appAPIEntityItem = {
            label: "AppAPI Entity",
            description: "app/services/app_api/entities/**/SINGULARIZE.rb"
        };
        const adminViewItem = {
            label: "Admin View",
            description: "admin_view/src/views/**/PTN.vue"
        };
        const mailerItem = {
            label: "Mailer",
            description: "app/mailers/**/SINGULARIZE_mailer.rb"
        };
        const mailerView = {
            label: "Mailer View",
            description: "app/views/**/SINGULARIZE_mailer/*.html.erb"
        };

        if (this.filePath.indexOf("app/models/") >= 0) {
            this.modelName = this.fileName.replace(/\.rb$/, "").toString();
            this.patterns = [adminAPIItem, adminAPIEntityItem, appAPIItem, appAPIEntityItem, adminViewItem, mailerItem, mailerView];
        } else if (this.filePath.indexOf("app/services/admin_api/entities/") >= 0) {
            this.modelName = this.fileName.replace(/\.rb$/, "").toString();
            this.patterns = [modelItem, adminAPIItem, adminViewItem];
        } else if (this.filePath.indexOf("app/services/admin_api/") >= 0) {
            this.modelName = inflection.singularize(this.fileName.replace(/\.rb$/, "").toString());
            this.patterns = [modelItem, adminAPIEntityItem, adminViewItem];
        } else if (this.filePath.indexOf("app/services/app_api/entities") >= 0) {
            this.modelName = this.fileName.replace(/\.rb$/, "").toString();
            this.patterns = [modelItem, appAPIItem];
        } else if (this.filePath.indexOf("app/services/app_api/") >= 0) {
            this.modelName = inflection.singularize(this.fileName.replace(/\.rb$/, "").toString());
            this.patterns = [modelItem, appAPIEntityItem];
        } else if (this.filePath.indexOf("admin_view/src/views") >= 0) {
            this.modelName = inflection.singularize(this.fileName.replace(/\.vue$/, ""));
            this.patterns = [modelItem, adminAPIItem, adminAPIEntityItem];
        } else if (this.filePath.indexOf("app/mailers") >= 0) {
            this.modelName = this.fileName.replace(/_mailer\.rb$/, "").toString();
            this.patterns = [modelItem, mailerView];
        } else if (this.filePath.indexOf("app/views/") >= 0 && this.filePath.indexOf("_mailer/") >= 0) {
            this.modelName = (this.filePath.split("/").at(-2) || "").replace(/_mailer$/, "").toString();
            this.patterns = [modelItem, mailerItem];
        } else {
            this.modelName = "";
            this.patterns = [];
        }
    }

    public searchPaths() {
        var res: { label: string, description: string }[] = [];
        this.patterns.forEach(e => {
            var p = e.description.replace("PTN", inflection.pluralize(this.modelName.toString()));
            p = p.replace("SINGULARIZE", this.modelName.toString());
            e.description = p;
            res.push(e);
        });
        return res;
    }

    public items: { label: string, description: string, target: string, kind: vscode.QuickPickItemKind }[] = [];
    private generateList(arr: { label: string, description: string }[]) {
        var that = this;
        var item = (arr.shift() || { label: "", description: "" });

        vscode.workspace.findFiles(item.description.toString(), null).then((res) => {
            res.forEach(i => {
                var fn = vscode.workspace.asRelativePath(i);
                that.items.push({ label: item.label, description: fn, target: fn, kind: vscode.QuickPickItemKind.Default });
                // that.items.push({
                //     label: item.label, description: fn, target: fn, kind: vscode.QuickPickItemKind.Separator
                // });
            });
            if (arr.length > 0) {
                that.generateList(arr);
            }
            else {
                this.showQuickPick(that.items);
            }
        });

    }

    public showQuickPick(items: { label: string, target: string }[]) {
        const p = vscode.window.showQuickPick(items, { placeHolder: "Select File", matchOnDetail: true });
        const workspace = vscode.workspace;
        const rootPath = workspace.rootPath || "";
        p.then(value => {
            if (!value) { return; };
            const fn = vscode.Uri.parse('file://' + join(rootPath, value.target));
            vscode.workspace.openTextDocument(fn).then(doc => {
                return vscode.window.showTextDocument(doc);
            });
        });
    }

    public showFileList() {
        if (this.modelName !== "") {
            var items = this.searchPaths();
            this.generateList(items);
        }
    }
}