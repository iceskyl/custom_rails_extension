const inflection = require('inflection');
import { dirname, basename } from 'path';

export class Model {
	relativePath: string;

	public constructor(relativePath: string) {
		this.relativePath = relativePath;
	}

	get modelName(): ActiveModelName {
		return new ActiveModelName(this.relativePath);
	}
}

export class ActiveModelName {
	relativePath: string;

	public constructor(relativePath: string) {
		this.relativePath = relativePath;
	}

	get fileName(): string {
		return basename(this.relativePath);
	}

	get filePath(): string {
		return dirname(this.relativePath);
	}

	get namespace(): string[] {
		const filePathArray = this.filePath.split("/");

		if (this.filePath.indexOf("app/models/") >= 0) {
			return filePathArray.slice(2, filePathArray.length - 1);
		} else {
			return [];
		}
	}

	get element(): string {
		if (this.filePath.indexOf("app/models") >= 0) {
			return this.fileName.replace(/\.rb$/, "");
		} else {
			return "";
		}
	}

	get member(): string {
		return [...this.namespace, this.element].join("/");
	}

	get collection(): string {
		return inflection.pluralize(this.member);
	}
}