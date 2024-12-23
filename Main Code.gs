let progress = 0; // Global variable to track progress

function startReportGeneration(schoolName, term) {
  const scriptProperties = PropertiesService.getScriptProperties();

  // Reset progress when starting a new report generation
  scriptProperties.deleteAllProperties();

  // Set the required values in script properties
  scriptProperties.setProperty('schoolName', schoolName);
  scriptProperties.setProperty('term', term);
  scriptProperties.setProperty('processedStudents', 0);

  // Initialize report count
  scriptProperties.setProperty('reportCount', 0);
  scriptProperties.setProperty('num', 1);

  // Trigger the first batch processing
  processBatch();
}

function processBatch() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // Retrieve required values from script properties
  const schoolName = scriptProperties.getProperty('schoolName');
  const term = scriptProperties.getProperty('term');
  let reportCount = parseInt(scriptProperties.getProperty('reportCount') || '0');
  let processedStudents = parseInt(scriptProperties.getProperty('processedStudents') || '0');
  let num = parseInt(scriptProperties.getProperty('num') || '1');

  if (!schoolName || !term) {
    throw new Error("Missing required parameters: schoolName or term.");
  }

  // Open the active spreadsheet and the source sheet
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = activeSpreadsheet.getSheetByName('Class Details');
  const dataRange = sourceSheet.getDataRange();
  const data = dataRange.getValues();

  const totalStudents = data.length - 2; // Assuming the first two rows are headers
  const batchSize = 30; // Define batch size
  const startIdx = reportCount;
  const endIdx = Math.min(reportCount + batchSize, totalStudents);


  Logger.log(`Processing batch from ${startIdx + 2} to ${endIdx + 2} for ${schoolName}`);

 const spreadsheet = SpreadsheetApp.create(`${schoolName} ${num}`);

  for (let i = startIdx + 2; i < endIdx + 2; i++) {
    const row = data[i];
    const student = {
      name: row[1],
      grade: row[2],
      term: term,
      instructor: row[13],
      skills: {
        "Presentation Skills (10)": row[3],
        "Teamwork (10)": row[4],
        "Time Management (10)": row[5],
        "Engineering Design (10)": row[6],
        "Critical Thinking (10)": row[7],
        "Class Participation (10)": row[8],
        "Consistency (10)": row[9],
        "H/Work (10)": row[10],
        "Building Skills (20)": row[11]
      },
      totalScore: row[12],
      fileId: '1-F6FIoBOQTJOzqgEl_-otSpS_9tcyGtV',
      imageA1: "https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_2/73cd23c03abc4e5cbfc3fb3b2c465e70"
    };

    let sheetName = student.name.substring(0, 30).replace(/[\/\\?*:|"<>\.]/g, '') || 'Unnamed Student';
    const sheet = spreadsheet.insertSheet(sheetName);

    const columnWidths = [150, 270, 127, 337, 233, 140, 200, 122];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    sheet.getRange("C1:F2").merge().setValue("STUDENT SKILL ASSESSMENT TERMLY REPORT")
      .setFontSize(18).setFontWeight("bold").setFontColor("#FFFFFF").setBackground("#20124d").setHorizontalAlignment("center");

    
    // Additional sheet configuration...

 sheet.getRange("C4:F4").merge().setValue(schoolName)
      .setFontSize(18).setFontWeight("bold").setFontColor("#a3170d").setBackground("#ffd966").setHorizontalAlignment("center");
    sheet.getRange("C4:F4").setBorder(true, true, true, true, true, true);

    sheet.getRange("B7:C7").merge().setValue(student.name)
      .setFontSize(18).setFontWeight("bold").setBackground("#4a86e8");

    sheet.getRange("A9").setValue("Grade").setFontSize(18).setFontWeight("bold");
    sheet.getRange("B9").setValue(student.grade).setFontSize(18).setFontWeight("bold").setBorder(true, true, true, true, false, false);

    sheet.getRange("A11").setValue("Instructor").setFontSize(18).setFontWeight("bold");
    sheet.getRange("B11").setValue(student.instructor).setFontSize(18).setFontWeight("bold").setBorder(true, true, true, true, true, true);

    sheet.getRange("F7").setValue("TERM:").setFontSize(18).setFontWeight("bold");
    sheet.getRange("G7").setValue(student.term).setFontSize(18).setFontWeight("bold").setBackground("#4a86e8");

    const skillHeaders = [["Soft / Hard Skills", "Score"]];
    sheet.getRange("D15:E15").setValues(skillHeaders)
      .setFontWeight("bold").setFontColor("#FFFFFF").setBackground("#073763").setHorizontalAlignment("center").setFontSize(18);

    let rowIdx = 16;
    Object.entries(student.skills).forEach(([skill, score]) => {
      sheet.getRange(`D${rowIdx}`).setValue(skill).setFontWeight("bold").setFontSize(18);
      sheet.getRange(`E${rowIdx}`).setValue(score).setFontWeight("bold").setFontColor("#f9a520").setFontSize(18).setFontFamily("Inconsolata");
      rowIdx++;
    });

    sheet.getRange("D25").setValue("Total Score").setFontWeight("bold").setFontSize(18);
    sheet.getRange("E25").setValue(student.totalScore).setFontWeight("bold").setFontSize(18).setFontColor("#f9a520");

    sheet.getRange("D15:E25").setBorder(true, true, true, true, true, true, null, SpreadsheetApp.BorderStyle.SOLID_THICK);

    sheet.getRange("F27").setFormula(`=IMAGE("https://drive.google.com/uc?export=view&id=${student.fileId}", 1)`);
    sheet.getRange("F27").setBorder(false, false, true, false, false, false, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    sheet.setRowHeight(27, 75);

    sheet.getRange("E30:H32").merge().setValue("General Manager\nBountiful Technologies Co. Ltd.")
      .setFontSize(18).setFontWeight("bold").setHorizontalAlignment("center").setFontColor("#0c18ff");

    const imgA1 = UrlFetchApp.fetch(student.imageA1).getBlob();
    const imageA1 = sheet.insertImage(imgA1, 1, 1);
    imageA1.setHeight(100);
    imageA1.setWidth(159);

    processedStudents++;
    scriptProperties.setProperty('processedStudents', processedStudents);

    // Update progress after each student
    progress = (processedStudents / totalStudents) * 100;
    scriptProperties.setProperty('progress', progress);
    
    // Update report count and progress
    reportCount++;
    scriptProperties.setProperty('reportCount', reportCount);
    progress = (reportCount / totalStudents) * 100;
    scriptProperties.setProperty('progress', progress);

   
  }

  if (endIdx < totalStudents) {
    num++;
    scriptProperties.setProperty('num', num);
   nextFunction();
    // Wait for 30 seconds (30000 milliseconds)
  Utilities.sleep(5000);
  }
}

function getProgress() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('progress') || 0;
}
