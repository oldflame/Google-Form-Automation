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
      form.setTitle("Personal Sprint Reflection");
      for (var j = 1; j < questions.length; j++) {
        if (questions[j][0].trim() == "TEXT") {
          var textItem = form.addParagraphTextItem().setRequired(questions[j][1]);
          textItem.setTitle(questions[j][2]);
        } else if (questions[j][0].trim() == "GRID") {
          var item = form.addGridItem();
          item
            .setTitle(questions[j][2])
            .setRows(teams[i].slice(2))
            .setColumns(questions[j].slice(3).filter(q => q != "")).setRequired(questions[j][1])
          theFolder.addFile(DriveApp.getFileById(form.getId()));
        } else if (questions[j][0].trim() == "LIST") {
          var listItemOne = form.addListItem();
          listItemOne.setTitle(questions[j][2]);
          optionsForList = questions[j].slice(3).filter(function(q) {
            return q != "";
          });
          listItemOne.setChoiceValues(optionsForList).setRequired(questions[j][1]);
        } else if (questions[j][0].trim() == "SCALE") {
          var scaleItem = form.addScaleItem();
          scaleItem
            .setTitle(questions[j][2])
            .setBounds(questions[j][3], questions[j][4]).setRequired(questions[j][1]);
        } else if (questions[j][0].trim() == "LISTCUSTOM") {
          var listItemTwo = form.addListItem();
          listItemTwo.setTitle(questions[j][2]);
          optionsForList = teams[i].slice(2);
          listItemTwo.setChoiceValues(optionsForList).setRequired(questions[j][1]);
        }
        else if(questions[j][0].trim() == "PAGEBREAK"){
        var pageBreak = form
            .addPageBreakItem()
            .setTitle(questions[j][2]);
        }
      }
      activeFormURL = form.getPublishedUrl();
      Logger.log(teams[i][1]);
      sendEmail(teams[i][1], 'MSD PSR Google Form',activeFormURL)
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
