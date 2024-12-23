function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Report Generator')
    .addItem('Open Generator', 'openReportGenerator')
    .addToUi();
}

function openReportGenerator() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('ReportGenerator')
    .setWidth(400)
    .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Report Generator');
}
