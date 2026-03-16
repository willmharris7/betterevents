import { ipcMain, shell, BrowserWindow, app } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
function customFunctions() {
  ipcMain.handle("open-external", (_event, url) => shell.openExternal(url));
  ipcMain.handle("fetchMeetup", async (_event, date, time) => {
    const currentDay = new Date(date);
    currentDay.setDate(currentDay.getDate() + 1);
    const nextDay = currentDay.toISOString().split("T")[0];
    const meetupURL = `https://www.meetup.com/find/?location=us--or--Portland&source=EVENTS&customStartDate=${date}T03%3A00%3A00-04%3A00&customEndDate=${nextDay}T02%3A59%3A59-04%3A00&eventType=inPerson&distance=twentyFiveMiles`;
    const res = await fetch(meetupURL);
    const meetupHTML = await res.text();
    const meetupDoc = new DOMParser().parseFromString(meetupHTML, "text/html");
    return Array.from(meetupDoc.querySelectorAll('a[data-event-label="Event Card"]')).map((a) => {
      var _a, _b, _c, _d, _e;
      return {
        href: a.href,
        title: ((_a = a.querySelector("h3")) == null ? void 0 : _a.textContent) ?? "",
        img: ((_b = a.querySelector("img")) == null ? void 0 : _b.src) ?? "",
        time: ((_c = a.querySelector("time")) == null ? void 0 : _c.textContent) ?? "",
        group: ((_d = a.querySelector("div.flex-shrink.min-w-0.truncate")) == null ? void 0 : _d.textContent) ?? "",
        attendees: ((_e = a.querySelector("span.ds2-m14.py-ds2-8")) == null ? void 0 : _e.textContent) ?? "",
        price: ""
      };
    });
  });
  ipcMain.handle("fetchEventbrite", async (_event, date, time) => {
    const eventbriteURL = `https://www.eventbrite.com/d/or--portland/all-events/?page=1&start_date=${date}&end_date=${date}`;
    const win2 = new BrowserWindow({ show: false });
    await win2.loadURL(eventbriteURL);
    await new Promise((resolve) => setTimeout(resolve, 6e3));
    const html = await win2.webContents.executeJavaScript("document.documentElement.outerHTML");
    win2.destroy();
    return html;
  });
}
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    show: false,
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.once("ready-to-show", () => {
    win == null ? void 0 : win.maximize();
    win == null ? void 0 : win.show();
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
customFunctions();
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
