﻿/// <reference path="../src/survey.ts" />
/// <reference path="../src/page.ts" />
/// <reference path="../src/question.ts" />
/// <reference path="../src/question_baseselect.ts" />
/// <reference path="../src/question_checkbox.ts" />
/// <reference path="../src/question_matrix.ts" />
/// <reference path="../src/question_multipletext.ts" />
/// <reference path="../src/question_radiogroup.ts" />
/// <reference path="../src/question_matrixdropdown.ts" />
/// <reference path="../src/questionfactory.ts" />
module Survey.Tests {
    QUnit.module("Survey_Questions");

    QUnit.test("Only some questions support comment", function (assert) {
        var questionText = <Question>QuestionFactory.Instance.createQuestion("text", "textQuestion");

        assert.equal(questionText.supportComment(), false, "Text question doesn't support comment.");
        assert.equal(questionText.hasComment, false, "Text question doesn't support comment.");
        questionText.hasComment = true;
        assert.equal(questionText.hasComment, false, "You can't set has comment to the text question.");

        var questionDropDown = <Question>QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
        assert.equal(questionDropDown.supportComment(), true, "Drop down question supports comment.");
        assert.equal(questionDropDown.hasComment, false, "Has comment is false by  default.");
        questionDropDown.hasComment = true;
        assert.equal(questionDropDown.hasComment, true, "You can set comment for drop down question.");
    });
    QUnit.test("Only some questions support other", function (assert) {
        var questionText = <Question>QuestionFactory.Instance.createQuestion("text", "textQuestion");

        assert.equal(questionText.supportOther(), false, "Text question doesn't support other.");
        assert.equal(questionText.hasOther, false, "Text question doesn't support other.");
        questionText.hasOther = true;
        assert.equal(questionText.hasOther, false, "You can't set has other to the text question.");

        var questionDropDown = <Question>QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
        assert.equal(questionDropDown.supportOther(), true, "Drop down question supports other.");
        assert.equal(questionDropDown.hasOther, false, "Has other is false by  default.");
        questionDropDown.hasOther = true;
        assert.equal(questionDropDown.hasOther, true, "You can set other for drop down question.");
    });
    QUnit.test("Comment and other could not be set together", function (assert) {
        var questionDropDown = <Question>QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
        assert.equal(questionDropDown.hasComment, false, "Initial comment is turn off.");
        assert.equal(questionDropDown.hasOther, false, "Initial other is turn off.");

        questionDropDown.hasOther = true;
        assert.equal(questionDropDown.hasOther, true, "set initially other to true");

        questionDropDown.hasComment = true;
        assert.equal(questionDropDown.hasComment, true, "After set comment to true");
        assert.equal(questionDropDown.hasOther, false, "After set comment to true");

        questionDropDown.hasOther = true;
        assert.equal(questionDropDown.hasComment, false, "After set other to true");
        assert.equal(questionDropDown.hasOther, true, "After set other to true");
    });
    QUnit.test("visibleChoices changes on setting others to true/false", function (assert) {
        var question = new QuestionSelectBase("dropdownQuestion");
        question.choices = ["One", "Two", "Three"];
        assert.equal(question.visibleChoices.length, 3, "By default visibleChoices equals to choices");
        question.hasOther = true;
        assert.equal(question.visibleChoices.length, 4, "Add one more item for others");
        question.hasOther = false;
        assert.equal(question.visibleChoices.length, 3, "Remove the others item");
    });
    QUnit.test("Question Title property", function (assert) {
        var question = new QuestionTextModel("q1");
        assert.equal(question.title, "q1", "get the question name by default");
        question.title = "My title";
        assert.equal(question.title, "My title", "get the question name by default");
    });
    QUnit.test("Pre-proccess value for Checkbox", function (assert) {
        var survey = new SurveyModel();
        var page = survey.addNewPage("Page 1");
        var question = new QuestionCheckboxModel("checkboxQuestion");
        question.choices = ["One", "Two", "Three"];
        page.addQuestion(question);

        survey.setValue("checkboxQuestion", "One");
        assert.equal(question.value, ["One"], "convert value to array");
    });
    QUnit.test("Matrix Question: visible rows", function (assert) {
        var matrix = new QuestionMatrixModel("q1");
        assert.equal(matrix.hasRows, false, "There is now rows by default.");
        assert.equal(matrix.visibleRows.length, 1, "There is always at least one row");
        assert.equal(matrix.visibleRows[0].name, null, "The default row name is empty");
        assert.equal(matrix.visibleRows[0].fullName, "q1", "The default row fullName is the question name");
        matrix.rows = ["row1", "row2"];
        assert.equal(matrix.hasRows, true, "There are two rows");
        assert.equal(matrix.visibleRows.length, 2, "Use the added row");
        assert.equal(matrix.visibleRows[0].name, "row1", "the row name is 'row1'");
        assert.equal(matrix.visibleRows[0].fullName, "q1_row1", "The default row fullName is the question name");
    });
    QUnit.test("Matrix Question: get/set values for empty rows", function (assert) {
        var matrix = new QuestionMatrixModel("q1");
        matrix.columns = ["col1", "col2"];
        matrix.value = "col1";
        var rows = matrix.visibleRows;
        assert.equal(rows[0].value, "col1", "set the row value correctly");
        rows[0].value = "col2";
        assert.equal(rows[0].value, "col2", "the row value changed");
        assert.equal(matrix.value, "col2", "the matrix value changed correctly");
    });
    QUnit.test("Matrix Question: get/set values for two rows", function (assert) {
        var matrix = new QuestionMatrixModel("q1");
        matrix.rows = ["row1", "row2"];
        matrix.columns = ["col1", "col2"];
        matrix.value = { row1: "col1" };
        var rows = matrix.visibleRows;
        assert.equal(rows[0].value, "col1", "set the row value correctly");
        rows[0].value = "col2";
        assert.equal(rows[0].value, "col2", "the row value changed");
        assert.deepEqual(matrix.value, { row1: "col2" }, "the matrix value changed correctly");
        rows[1].value = "col1";
        assert.deepEqual(matrix.value, { row1: "col2", row2: "col1" }, "the matrix value changed correctly");
    });
    QUnit.test("Matrix Question set values after visible row generated", function (assert) {
        var matrix = new QuestionMatrixModel("q1");
        matrix.rows = ["row1", "row2"];
        matrix.columns = ["col1", "col2"];
        var rows = matrix.visibleRows;
        matrix.value = { row1: "col1" };
        assert.equal(rows[0].value, "col1", "set the row value correctly");
    });
    QUnit.test("Multiple Text Item: text property", function (assert) {
        var mItem = new MultipleTextItemModel("text1");
        assert.equal(mItem.title, "text1", "get value from name");
        mItem.title = "display1";
        assert.equal(mItem.title, "display1", "get value from textValue");
    });
    QUnit.test("Multiple Text Question: get/set values for two texts", function (assert) {
        var mText = new QuestionMultipleTextModel("q1");
        mText.items.push(new MultipleTextItemModel("text1"));
        mText.items.push(new MultipleTextItemModel("text2"));
        mText.value = { text1: "val1" };
        assert.equal(mText.items[0].value, "val1", "get the value from the question");
        mText.items[1].value = "val2";
        assert.deepEqual(mText.value, { text1: "val1", text2: "val2" }, "set the value from the text item");
    });
    QUnit.test("Validators for text question", function (assert) {
        var mText = new QuestionTextModel("");
        assert.equal(mText.hasErrors(), false, "There is no error by default");
        mText.validators.push(new NumericValidator(10, 20));
        mText.value = "ss";
        assert.equal(mText.hasErrors(), true, "The value should be numeric");
        mText.value = 25;
        assert.equal(mText.hasErrors(), true, "The value should be between 10 and 20");
        mText.value = "15";
        assert.equal(mText.hasErrors(), false, "The value is fine now.");
        assert.equal(mText.value, 15, "Convert to numeric");
    });
    QUnit.test("Validators for multiple text question", function (assert) {
        var mText = new QuestionMultipleTextModel("q1");
        mText.items.push(new MultipleTextItemModel("t1")); 
        assert.equal(mText.hasErrors(), false, "There is no error by default");
        mText.items[0].validators.push(new NumericValidator(10, 20));
        mText.value = { t1: "ss" };
        assert.equal(mText.hasErrors(), true, "The value should be numeric");
        mText.value = { t1: 25 };
        assert.equal(mText.hasErrors(), true, "The value should be between 10 and 20");
        assert.equal(mText.errors[0].getText().indexOf("t1") >= 0, true, "Error contains information about item name");
        mText.value = { t1: 15 };
        assert.equal(mText.hasErrors(), false, "The value is fine now.");
        assert.equal(mText.items[0].value, 15, "Convert to numeric");
    });
    QUnit.test("Validators for array value question", function (assert) {
        var question = new QuestionCheckboxModel("q1");
        question.choices = ["item1", "item2", "item3", "item4", "item5"];
        question.value = ["item1"];
        assert.equal(question.hasErrors(), false, "There is no error by default");
        question.validators.push(new AnswerCountValidator(2, 3));
        question.value = ["item1"];
        assert.equal(question.hasErrors(), true, "It should be at least two items selected");
        question.value = ["item1", "item2", "item3"];
        assert.equal(question.hasErrors(), false, "There is one item in value");
        question.value = ["item1", "item2", "item3", "item4"];
        assert.equal(question.hasErrors(), true, "It should be less then 3 items");
        question.value = ["item1", "item3"];
        assert.equal(question.hasErrors(), false, "There is two items in value");
    });
    QUnit.test("Show errors if others value is selected, but not entered", function (assert) {
        var radio = new QuestionRadiogroupModel("q1");
        new SurveyModel().addNewPage("p1").addQuestion(radio);
        radio.choices = ["one"];
        radio.hasOther = true;
        assert.equal(radio.hasErrors(), false, "There is no error by default");
        radio.value = radio.otherItem.value;
        assert.equal(radio.hasErrors(), true, "The other comment should be entered");
        radio.comment = "Many";
        assert.equal(radio.hasErrors(), false, "We have entered the comment");
    });
    QUnit.test("SelectBase visibleChoices order", function (assert) {
        var question = new QuestionSelectBase("dropdownQuestion");
        question.choices = ["B", "A", "D", "C"];
        assert.equal(question.choicesOrder, "none", "The default value is 'none'");
        assert.equal(question.visibleChoices[0].text, "B", "By default visible choices is not sorted");
        question.choicesOrder = "asc";
        assert.equal(question.visibleChoices[0].text, "A", "Sorted order is 'asc'");
        question.choicesOrder = "desc";
        assert.equal(question.visibleChoices[0].text, "D", "Sorted order is 'desc'");
    });
    QUnit.test("Question callbacks test", function (assert) {
        var question = new QuestionTextModel("textQuestion");
        var valueChanged = 0;
        var commentChanged = 0;
        var visibleChanged = 0;
        var visibleIndexChanged = 0;
        question.valueChangedCallback = function () { valueChanged++ };
        question.commentChangedCallback = function () { commentChanged++ };
        question.visibilityChangedCallback = function () { visibleChanged++ };
        question.visibleIndexChangedCallback = function () { visibleIndexChanged++ };
        question.value = "test";
        question.comment = "comment";
        question.visible = false;
        question.setVisibleIndex(5);
        assert.equal(valueChanged, 1, "value changed on time");
        assert.equal(commentChanged, 1, "comment changed on time");
        assert.equal(visibleChanged, 1, "visibiblity changed on time");
        assert.equal(visibleIndexChanged, 1, "visibleIndex changed on time");
    });
    QUnit.test("Matrixdropdown cells tests", function (assert) {
        var question = new QuestionMatrixDropdownModel("matrixDropdown");
        question.rows = ["row1", "row2", "row3"];
        question.columns.push(new MatrixDropdownColumn("column1"));
        question.columns.push(new MatrixDropdownColumn("column2"));
        question.choices = [1, 2, 3];
        question.columns[1].choices = [4, 5];
        question.value = { 'row2': { 'column1': 2 } }
        var visibleRows = question.visibleRows;
        assert.equal(visibleRows.length, 3, "There are three rows");
        assert.equal(visibleRows[0].cells.length, 2, "There are two cells in each row");
        assert.equal(visibleRows[2].cells.length, 2, "There are two cells in each row");
        assert.equal(visibleRows[0].cells[0].choices, question.choices, "get choices from matrix");
        assert.equal(visibleRows[0].cells[1].choices, question.columns[1].choices, "get choices from column");
        assert.equal(visibleRows[0].cells[1].value, null, "value is not set");
        assert.equal(visibleRows[1].cells[0].value, 2, "value was set");

        question.value = null;
        visibleRows[0].cells[1].value = 4;
        assert.deepEqual(question.value, { 'row1': { 'column2': 4 } }, "set the cell value correctly");
        visibleRows[0].cells[1].value = null;
        assert.deepEqual(question.value, null, "set to null if all cells are null");
    });
    QUnit.test("Matrixdropdown value tests after cells generation", function (assert) {
        var question = new QuestionMatrixDropdownModel("matrixDropdown");
        question.rows = ["row1", "row2", "row3"];
        question.columns.push(new MatrixDropdownColumn("column1"));
        question.columns.push(new MatrixDropdownColumn("column2"));
        question.choices = [1, 2, 3];
        question.columns[1].choices = [4, 5];
        var visibleRows = question.visibleRows;
        question.value = { 'row2': { 'column1': 2 } }
        assert.equal(visibleRows[1].cells[0].value, 2, "value was set");
    });
    QUnit.test("Matrixdropdown different cell types", function (assert) {
        var question = new QuestionMatrixDropdownModel("matrixDropdown");

        question.columns.push(new MatrixDropdownColumn("dropdown"));
        question.columns.push(new MatrixDropdownColumn("checkbox"));
        question.columns.push(new MatrixDropdownColumn("radiogroup"));
        question.columns.push(new MatrixDropdownColumn("text"));
        question.columns.push(new MatrixDropdownColumn("comment"));

        for (var i = 0; i < question.columns.length; i++) {
            question.columns[i].cellType = question.columns[i].name;
        }
        question.rows = ["row1", "row2", "row3"];

        for (var i = 0; i < question.columns.length; i++) {
            var col = question.columns[i];
            var row = question.visibleRows[0];
            assert.equal(row.cells[i].question.getType(), col.name, "Expected " + col.name + ", but was" + row.cells[i].question.getType());
        }
    });
}