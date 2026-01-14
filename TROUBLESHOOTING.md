# Troubleshooting Form Submission Issues

If your form submissions aren't appearing in Google Sheets, follow these steps:

## Step 1: Verify Your Google Apps Script is Deployed

1. Open your Google Apps Script project (Extensions > Apps Script in your Google Sheet)
2. Click "Deploy" > "Manage deployments"
3. Make sure you have a deployment with:
   - **Type**: Web app
   - **Who has access**: Anyone (or "Anyone with Google account" if you prefer)
   - **Execute as**: Me

4. **Important**: If you made changes to the script, you need to create a NEW deployment or update the existing one:
   - Click the pencil icon next to your deployment
   - Click "New version"
   - Click "Deploy"
   - Copy the NEW Web App URL

## Step 2: Test Your Script Directly

1. Copy your Web App URL
2. Open it in a new browser tab
3. You should see a JSON response like:
   ```json
   {
     "status": "success",
     "message": "Script is working!",
     "spreadsheet": "Your Sheet Name",
     "sheet": "Sheet1",
     "lastRow": 1
   }
   ```
4. If you see an error, check the error message

## Step 3: Check Execution Logs

1. In Google Apps Script editor, click "Executions" (clock icon on the left)
2. Look for recent executions when you submitted the form
3. Click on an execution to see:
   - If it succeeded or failed
   - Any error messages
   - Log output (click "View logs" to see Logger.log messages)

## Step 4: Verify Your Google Sheet Setup

1. Make sure your Google Sheet has these headers in Row 1:
   - Column A: Timestamp
   - Column B: Name
   - Column C: Email
   - Column D: UTR
   - Column E: Favorite Player

2. Make sure the script is attached to the correct spreadsheet:
   - The script should be created from Extensions > Apps Script within your Google Sheet
   - OR update the script to use a specific Spreadsheet ID (see Step 5)

## Step 5: Use a Specific Spreadsheet ID (If Needed)

If your script is not attached to the correct spreadsheet:

1. Get your Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
   Copy the part between `/d/` and `/edit`

2. In your Google Apps Script, uncomment and update these lines:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
   const sheet = spreadsheet.getActiveSheet();
   ```

3. Comment out or remove the line:
   ```javascript
   // const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
   ```

4. Save and redeploy as a new version

## Step 6: Test with the Test Function

1. In Google Apps Script editor, select the `testDoPost` function from the dropdown
2. Click the Run button (▶️)
3. Authorize the script if prompted
4. Check your Google Sheet - you should see a test row appear
5. Check the Execution logs to see if it worked

## Step 7: Check Browser Console

1. Open your website in a browser
2. Open Developer Tools (F12 or Right-click > Inspect)
3. Go to the Console tab
4. Submit the form
5. Look for any error messages in red

## Common Issues:

### Issue: "Script is not authorized"
- **Solution**: Run the testDoPost function once to authorize the script

### Issue: "Cannot find method getActiveSpreadsheet"
- **Solution**: Make sure the script is created from within your Google Sheet, or use SpreadsheetApp.openById() with a specific ID

### Issue: Form submits but no data appears
- **Solution**: Check execution logs in Apps Script to see if there are errors
- Make sure the sheet name matches (default is usually "Sheet1")

### Issue: CORS errors in browser console
- **Solution**: This is normal with Google Apps Script Web Apps. The form should still work even if you see CORS warnings.

## Still Not Working?

1. Double-check that your Web App URL in `tryouts.html` matches your deployed script URL exactly
2. Make sure you're testing with the latest deployment version
3. Try creating a completely new deployment
4. Check that your Google Sheet has edit permissions enabled

