# Desktop Timer

An always-on-top floating countdown timer widget for Windows. Unlike the
browser-based `FullscreenTimerApp`, this one is a real desktop app (built
with Electron) that stays pinned above every other window — even while
you're working in another app — until you hide or close it.

## Features

- **Compact floating widget** — small, frameless, draggable clock that sits
  in a corner of the screen and stays on top of everything else.
- **Expand / collapse** — click ⤢ to open a larger panel with presets, a
  custom minute/second picker, and a progress ring; click ⤡ to collapse
  back to the compact widget.
- **Always-on-top, even over fullscreen apps** — uses Electron's
  `screen-saver` always-on-top level. Click 📌 in the expanded view to
  temporarily unpin it.
- **System tray icon** — closing the widget (✕) hides it to the tray
  instead of quitting; use the tray menu to show it again or quit for real.
- **Sound alert** when the timer reaches zero, with a flashing "TIME'S UP"
  state and a progress ring/bar that shifts green → amber → red.

## School Day mode and settings

- **School Day** shows the live clock, the current period and a countdown to
  the next bell. It keeps running alongside the manual timer, and each view
  shows a small status chip for the other one.
- **Edit period times** (Settings, then "Edit period times") lets staff change
  the Mon/Tue/Wed/Fri and Thursday timetables. Times are 24-hour, saved
  locally on that PC, and take effect immediately. "Reset to defaults" restores
  the original times.
- Settings also cover the end-of-time message, colour scheme plus every
  individual colour, countdown clock size (Normal/Large/Huge) and window size.

## Running it (development)

```bash
cd DesktopTimerApp
npm install
npm start
```

This launches the app directly — no build/packaging needed to try it out.

## Building a Windows installer

```bash
npm run dist:win
```

This uses `electron-builder` to produce a portable `.exe` and an NSIS
installer in `dist/`. Building Windows targets from a non-Windows machine
requires [Wine](https://www.winehq.org/) to be installed (electron-builder
uses it to edit the `.exe`'s icon/version resources). On a native Windows
machine, just run the same command — no Wine needed.

## Notes

- The icon/tray artwork (`build/icon.ico`, `assets/tray.png`) is a simple
  placeholder generated for this app — swap it for your own if you'd like.
- Settings (last duration, sound on/off) persist locally via
  `localStorage`.
