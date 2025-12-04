const path = require('node:path');
const process = require('node:process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// The scope for reading calendar events.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Lists the next 10 events on the user's primary calendar.
 */
exports.createEvent = async function createEvent() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
    subject: 'naufalazmi020@gmail.com'
  });

  // Create a new Calendar API client.
  const calendar = google.calendar({version: 'v3', auth});
  // Get the list of events.
  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: 'Test Event',
      description: 'This is a test event',
      start: {
        dateTime: new Date().toISOString(), // tanggal hari ini dalam format YYYY-MM-DD
      },
      end: {
        dateTime: new Date().toISOString(),
      },
      attendees: [
      ],
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'email',
            minutes: 30
          },
          {
            method: 'popup',
            minutes: 30
          }
        ]
      }
    },
  });
}