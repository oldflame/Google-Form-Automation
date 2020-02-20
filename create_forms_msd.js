function myFunction() {
  var teams = getSheetDetails("14DIAE_OEenUM4QlNH253W1lsrh-jFMY_J-f7GUXTYd0");
  var questions = getSheetDetails(
    "1zraMIkuCZFu1OT29-t38gymjKzwE9q2YDUsjsp-ToOk"
  );
  Logger.log(questions);
  if (checkIfFolderAlreadyPresent("fromMethod")) {
    Logger.log("Creating Folder");
    theFolder = createFolder("fromMethod");
  } else {
    Logger.log("Folder already present");
    theFolder = DriveApp.getFoldersByName("fromMethod").next();
    for (var i = 1; i < 2; i++) {
      var formName = "MSD Form Team " + teams[i][0];
      var form = FormApp.create(formName);
      form.setTitle("DEVELOPER SECTION");
      for (var j = 1; j < questions.length; j++) {
        if (questions[j][0].trim() == "TEXT") {
          var textItem = form.addParagraphTextItem();
          textItem.setTitle(questions[j][1]);
        } else if (questions[j][0].trim() == "GRID") {
          var item = form.addGridItem();
          item
            .setTitle(questions[j][1])
            .setRows(teams[i].slice(2))
            .setColumns(questions[j].slice(2).filter(q => q != ""));
          theFolder.addFile(DriveApp.getFileById(form.getId()));
        } else if (questions[j][0].trim() == "LIST") {
          var listItemOne = form.addListItem();
          listItemOne.setTitle(questions[j][1]);
          optionsForList = questions[j].slice(2).filter(function(q) {
            return q != "";
          });
          listItemOne.setChoiceValues(optionsForList);
        } else if (questions[j][0].trim() == "SCALE") {
          var scaleItem = form.addScaleItem();
          scaleItem
            .setTitle(questions[j][1])
            .setBounds(questions[j][2], questions[j][3]);
        } else if (questions[j][0].trim() == "LISTCUSTOM") {
          var listItemTwo = form.addListItem();
          listItemTwo.setTitle(questions[j][1]);
          optionsForList = teams[i].slice(2);
          listItemTwo.setChoiceValues(optionsForList);
        } else if (questions[j][0].trim() == "LISTSECTION") {
          var pageBreak = form
            .addPageBreakItem()
            .setTitle("SCRUM MASTER SECTION");
          var listSectionItemOne = form.addMultipleChoiceItem();
          listSectionItemOne
            .setTitle(questions[j][1])
            .setChoices([
              listSectionItemOne.createChoice("Yes", pageBreak),
              listSectionItemOne.createChoice(
                "No",
                FormApp.PageNavigationType.SUBMIT
              )
            ]);
        }
      }
      activeFormURL = form.getPublishedUrl();
      Logger.log(teams[i][1]);
      //sendEmail(teams[i][1], 'MSD PSR Google Form',activeFormURL)
    }
  }
}

function sendEmail(recipients, subject, body) {
  GmailApp.sendEmail(recipients, subject, body);
}

function getSheetDetails(sheetId) {
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  return rows;
}

function checkIfFolderAlreadyPresent(folderName) {
  var theFolder = DriveApp.getFoldersByName(folderName);
  return !theFolder.hasNext();
}

function createFolder(folderName) {
  folder = DriveApp.createFolder(folderName);
  return folder;
}

function writeToJSON(data) {
  var theFolder = DriveApp.getFoldersByName("temp").next();
  theFolder.createFile(
    "questions.json",
    JSON.stringify(data),
    MimeType.PLAIN_TEXT
  );
}
