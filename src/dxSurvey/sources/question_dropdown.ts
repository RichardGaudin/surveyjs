﻿// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class QuestionDropdown extends QuestionSelectBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "dropdown";
        }
    }
    QuestionFactory.Instance.registerQuestion("dropdown", (name) => { return new QuestionDropdown(name); });
}