﻿// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="surveystrings.ts" />
module Survey {
    export class QuestionSelectBase extends Question {
        otherItem: ItemValue = new ItemValue("other", surveyLocalization.getString("otherItemText"));
        public choicesValues: Array<ItemValue> = new Array<ItemValue>();
        public otherErrorText: string = null;
        choicesOrderValue: string = "none";
        constructor(name: string) {
            super(name);
        }
        public get isOtherSelected(): boolean {
            return this.value == this.otherItem.value;
        }
        get choices(): Array<any> { return this.choicesValues; }
        set choices(newValue: Array<any>) {
            ItemValue.setData(this.choicesValues, newValue);
        }
        get choicesOrder(): string { return this.choicesOrderValue; }
        set choicesOrder(newValue: string) {
            if (newValue == this.choicesOrderValue) return;
            this.choicesOrderValue = newValue;
        }
        get otherText(): string { return this.otherItem.text; }
        set otherText(value: string) { this.otherItem.text = value; }
        get visibleChoices(): Array<ItemValue> {
            if (!this.hasOther && this.choicesOrder == "none") return this.choices;
            var result = this.sortVisibleChoices(this.choices.slice());
            if (this.hasOther) {
                result.push(this.otherItem);
            }
            return result;
        }
        public supportComment(): boolean { return true; }
        public supportOther(): boolean { return true; }
        protected onCheckForErrors(errors: Array<SurveyError>) {
            super.onCheckForErrors(errors);
            if (!this.isOtherSelected || this.comment) return;
            var text = this.otherErrorText;
            if (!text) {
                text = surveyLocalization.getString("otherRequiredError");
            }
            errors.push(new CustomError(text));
        }
        sortVisibleChoices(array: Array<ItemValue>): Array<ItemValue> {
            var order = this.choicesOrder.toLowerCase();
            if (order == "asc") return this.sortArray(array, 1);
            if (order == "desc") return this.sortArray(array, -1);
            if (order == "random") return this.randomizeArray(array);
            return array;
        }
        sortArray(array: Array<ItemValue>, mult: number): Array<ItemValue> {
            return array.sort(function (a, b) {
                if (a.text < b.text) return -1 * mult;
                if (a.text > b.text) return 1 * mult;
                return 0;
            });
        }
        randomizeArray(array: Array<ItemValue>): Array<ItemValue> {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    }

    export class QuestionCheckboxBase extends QuestionSelectBase {
        private colCountValue: number = 1;
        colCountChangedCallback: () => void;
        constructor(public name: string) {
            super(name);
        }
        public get colCount(): number { return this.colCountValue; }
        public set colCount(value: number) {
            if (value < 0 || value > 4) return;
            this.colCountValue = value;
            this.fireCallback(this.colCountChangedCallback);
        }
    }
    JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean", "!choices:itemvalues", "choicesOrder", "otherText", "otherErrorText"], null, "question");
    JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { ItemValue.setData(obj.choices, value); });
    JsonObject.metaData.setPropertyValues("selectbase", "choicesOrder", null, "none");
    JsonObject.metaData.setPropertyChoices("selectbase", "choicesOrder", ["none", "asc", "desc", "random"]);
    JsonObject.metaData.setPropertyValues("selectbase", "otherText", null, surveyLocalization.getString("otherItemText"));

    JsonObject.metaData.addClass("checkboxbase", ["colCount:number"], null, "selectbase");
    JsonObject.metaData.setPropertyValues("checkboxbase", "colCount", null, 1);
    JsonObject.metaData.setPropertyChoices("checkboxbase", "colCount", [0, 1, 2, 3, 4]);
}
