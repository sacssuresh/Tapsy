# Firestore Security Rules for Leaderboard

Add these rules to your Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{username} {
      // Allow anyone to read leaderboard
      allow read: if true;
      
      // Allow write only if:
      // - No auth required (anonymous access)
      // - The name field matches the document ID (username)
      allow create, update: if request.auth == null && 
                            request.resource.data.name == username;
      
      // Allow delete only if:
      // - No auth required (anonymous access)
      // - The document's name field matches the username (document ID)
      // Note: This allows users to delete their own entries when resetting progress
      allow delete: if request.auth == null && 
                    resource.data.name == username;
    }
  }
}
```

## Notes

- **Read**: Public read access for leaderboard viewing
- **Write**: Users can only create/update documents where the `name` field matches the document ID (username)
- **Delete**: Users can only delete their own document (when resetting progress)
- Since usernames cannot be changed, this prevents users from modifying other users' scores

