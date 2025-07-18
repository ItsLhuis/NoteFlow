<img src="assets/icon.png" width="100" height="100" />

# NoteFlow

**NoteFlow** is a modern note management application designed to provide an intuitive and efficient experience for organizing ideas, tasks, and personal or professional information. With support for multiple folders, advanced search, and theme customization, NoteFlow is ideal for users seeking simplicity combined with powerful features.

## Features

### Note Management

- Create, edit, and delete notes
- Organize notes into folders
- Instant search by text

### Folder Management

- Create and remove custom folders
- View all notes within a folder
- Assign colors and icons to folders (if applicable)

### Personalization & Themes

- Light and dark theme support
- Custom colors for notes

### User Experience

- Modern, responsive interface
- Smooth animations and transitions
- Intuitive navigation bar
- Quick access to common actions (delete, share, move, etc.)

### Additional Features

- Reminders and notifications (if applicable)
- Note sharing
- Local storage synchronization (AsyncStorage)

## Requirements

- Node.js version 16.x or higher
- npm or yarn
- React Native environment (Expo)

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ItsLhuis/NoteFlow
   cd NoteFlow
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the application in development mode:

   ```bash
   npx expo start
   ```

4. Follow the Expo instructions to open the app on an emulator or physical device.

## Project Structure

- `components/` — Reusable UI components
- `screens/` — Main application screens (Notes, Folders, Settings, etc.)
- `contexts/` — React contexts for global state management (notes, folders, theme, etc.)
- `config/` — Theme, color, and storage configurations
- `functions/` — Utility functions
- `assets/` — Images and icons

## How It Works

1. **Organization:** Create folders and notes as needed.
2. **Search:** Use the search bar to quickly find any note.
3. **Personalization:** Switch between light and dark themes and customize your note colors.
4. **Simple Management:** Edit, delete, or move notes and folders with just a few taps.
