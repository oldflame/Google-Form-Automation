function myFunction() {
  var teams = getSheetDetails("14DIAE_OEenUM4QlNH253W1lsrh-jFMY_J-f7GUXTYd0");
  var questions = getSheetDetails(
    "1zraMIkuCZFu1OT29-t38gymjKzwE9q2YDUsjsp-ToOk"
  );
  Logger.log(questions);
  if (checkIfFolderAlreadyPresent("fromMethod")) {
    theFolder = createFolder("fromMethod");
    //theFolder = DriveApp.createFolder('temp')
  } else {
    theFolder = DriveApp.getFoldersByName("fromMethod").next();
    for (var i = 1; i < teams.length; i++) {
      var formName = "MSD Form Team" + teams[i][0];
      var form = FormApp.create(formName);

      for (var j = 1; j < questions.length; j++) {
        var item = form.addGridItem();
        Logger.log(
          "questions",
          questions[j].filter(q => q != "")
        );
        item
          .setTitle(questions[j][0])
          .setRows(teams[i].slice(1))
          .setColumns(questions[j].slice(1).filter(q => q != ""));
        theFolder.addFile(DriveApp.getFileById(form.getId()));
      }
    }
  }
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
