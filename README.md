# Archive App
Organizing small museum collections on a property graph database with Electron, React, and JSON.

<img src="https://badgen.net/badge/status/not ready/orange">

## Usage

For development:

```
npm run dev
```

When you first load the app, it will prompt you for the location of a `db.json` database file and create a minimum file if one does not exist. The app will also prompt you for the folder locations of digital files associated with your collection's items. These settings will all be saved in the `appData` application directory, which differs based on your operating system:

```
%APPDATA% on Windows
$XDG_CONFIG_HOME or ~/.config on Linux
~/Library/Application Support on macOS
```

To build and package for distribution:

```
electron:package:mac
electron:package:win
electron:package:linux
```

