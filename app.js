import puppeteer from "puppeteer";
import GoLogin from "gologin";
import fs from "fs";

import {
  scroll_feed,
  post_group,
  join_group,
  search,
  set_up,
  post_on_profile,
} from "./facebook.js";
import { delay } from "./helper_function.js";

const { connect } = puppeteer;

const TOKEN = "";

// TARGET POST
let homepage_url =
  "https://www.facebook.com/photo?fbid=1243648057120269&set=a.769963507822062";

const screenshotFolder = "screenshot";
// Check if the folder exists, create it if it doesn't
if (!fs.existsSync(screenshotFolder)) {
  fs.mkdirSync(screenshotFolder);
  console.log(`Folder "${screenshotFolder}" created.`);
}

async function login(PROFILE_ID, PROFILE_NAME) {
  const GL = new GoLogin({
    token: TOKEN,
    profile_id: PROFILE_ID,
  });

  const { status, wsUrl } = await GL.start({
    args: [
      "--start-maximized", // Maximizes the window
    ],
  });

  if (status !== "success") {
    console.log("Invalid status");
    return;
  }

  const browser = await connect({
    browserWSEndpoint: wsUrl.toString(),
    ignoreHTTPSErrors: true,
  });

  // -------------------
  try {
    const page = await browser.newPage();

    let userSearch = Math.floor(Math.random() * 1000) + 1 < 10 ? true : false;
    let userPostProfile = Math.random() < 0.5;
    let userscrollAgain = Math.random() < 0.5;
    let userJoinGroup = Math.random() < 0.5;

    try {
      await scroll_feed(browser);
    } catch (error) {
      console.log("Error in scrolling", error);
    }

    try {
      await post_group(browser);
    } catch (error) {
      console.log("Error in posting", error);
    }

    if (userscrollAgain) {
      try {
        await scroll_feed(browser);
      } catch (error) {
        console.log("Error in scrolling", error);
      }
    }

    if (userJoinGroup) {
      try {
        await join_group(browser);
      } catch (error) {
        console.log("Error in Joining group", error);
      }
    }

    if (userSearch) {
      try {
        await search(browser);
      } catch (error) {
        console.log("Error in searcing", error);
      }
    }

    if (userPostProfile) {
      try {
        await post_on_profile(browser);
      } catch (error) {
        console.log("Error in posting", error);
      }
    }

    await closeResources(page, browser, GL);
  } catch (error) {
    console.log("Found error in login function");
  }
}

async function processAccountsWithDelay(profiles, batchSize = 2) {
  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    console.log(`Running batch: ${batch.join(", ")}`);

    // Run accounts in parallel
    await Promise.all(
      batch.map(async (profile) => {
        try {
          await login(profile.id);
          console.log(`Finished: ${profile.id}`);
        } catch (err) {
          console.error(`Error with ${profile.id}:`, err);
        }
      })
    );

    // Delay before next batch
    console.log("Waiting 5s before next batch...");
    await delay(5000);
  }
}

async function closeResources(page, browser, GL) {
  try {
    if (browser) {
      const pages = await browser.pages();

      // Keep the first tab open, close others
      for (let i = 0; i < pages.length; i++) {
        if (i !== 0) {
          await pages[i].close();
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    if (page && !page.isClosed()) {
      await page.close(); // Optional if you want to close the main page
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (browser && browser.isConnected()) {
      await browser.close();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (GL) await GL.stop();
  } catch (err) {
    console.error("Error closing resources:", err);
  }
}

// processAccountsWithDelay();
const response = await fetch("https://api.gologin.com/browser/v2", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

const data = await response.json();

let profiles = [
  "681dd8b0541dda9bfcdc4f1c",
  "681dd8a8541dda9bfcdc4dc5",
  "681dd8a8541dda9bfcdc4dc3",
  "681dd8a0541dda9bfcdc4cc6",
  "681dbcbb541dda9bfcd74c42",
  "681dae91541dda9bfcd5bef4",
];

let prof = [data.profiles[0]];
await processAccountsWithDelay(data.profiles, 3);
