// Simple Google Apps Script for Form Submissions
// Option 1: Use the spreadsheet this script is attached to (recommended)
// Just make sure the script is created from Extensions > Apps Script in your Google Sheet

// Option 2: Or specify a spreadsheet ID here
const SPREADSHEET_ID = '1ttRsxhV_-_y6DlAz4gMflqnvEpcQIF8oIfIlyFgOBeo';

function doPost(e) {
  try {
    Logger.log('=== Form Submission Started ===');
    
    // Get the spreadsheet
    let spreadsheet;
    if (SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      Logger.log('Using spreadsheet ID: ' + SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      Logger.log('Using active spreadsheet: ' + spreadsheet.getName());
    }
    
    // Parse the data
    Logger.log('Raw postData: ' + JSON.stringify(e.postData));
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    const timestamp = new Date();
    
    // Check if it's a contact form or tryout form
    if (data.type === 'contact') {
      Logger.log('Processing contact form');
      // Contact form - save to "Contact Messages" sheet
      let sheet = spreadsheet.getSheetByName('Contact Messages');
      if (!sheet) {
        Logger.log('Creating Contact Messages sheet');
        sheet = spreadsheet.insertSheet('Contact Messages');
        sheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Email', 'Message']);
      }
      
      const rowData = [
        timestamp,
        data.firstName || '',
        data.lastName || '',
        data.email || '',
        data.message || ''
      ];
      Logger.log('Appending contact row: ' + JSON.stringify(rowData));
      sheet.appendRow(rowData);
      Logger.log('Contact row appended successfully');
      
      // Send email
      GmailApp.sendEmail(
        'badgertennisclub@gmail.com',
        'New Contact Form Message',
        'Name: ' + (data.firstName || '') + ' ' + (data.lastName || '') + '\n' +
        'Email: ' + (data.email || '') + '\n\n' +
        'Message:\n' + (data.message || ''),
        { replyTo: data.email }
      );
      Logger.log('Email sent');
      
    } else {
      Logger.log('Processing tryout form');
      // Tryout form - save to "Tryout Signups" sheet
      let sheet = spreadsheet.getSheetByName('Tryout Signups');
      if (!sheet) {
        Logger.log('Creating Tryout Signups sheet');
        sheet = spreadsheet.insertSheet('Tryout Signups');
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'UTR', 'Favorite Player']);
      }
      
      const rowData = [
        timestamp,
        data.name || '',
        data.email || '',
        data.utr || '',
        data.favoritePlayer || ''
      ];
      Logger.log('Appending tryout row: ' + JSON.stringify(rowData));
      sheet.appendRow(rowData);
      Logger.log('Tryout row appended successfully');
    }
    
    Logger.log('=== Form Submission Completed Successfully ===');
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('=== ERROR ===');
    Logger.log('Error message: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    Logger.log('=== END ERROR ===');
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'success', message: 'Script is working!'}))
    .setMimeType(ContentService.MimeType.JSON);
}
