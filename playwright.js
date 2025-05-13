import axios from "axios";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";

import { chromium } from "playwright";
dotenv.config();

const GOLOGIN_API_TOKEN = process.env.GOLOGIN_API_TOKEN;

// Start the profile locally
async function startGoLoginProfile(profileId) {
  const url = `http://localhost:36912/browser/start-profile`;

  try {
    const response = await axios.post(
      url,
      {
        profileId: profileId,
        sync: true,
      },
      {
        headers: {
          Authorization: `Bearer ${GOLOGIN_API_TOKEN}`,
        },
      }
    );

    return response.data.wsUrl;
  } catch (error) {
    console.error(
      "❌ Failed to start profile:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Stop the profile locally
async function stopGoLoginProfile(profileId, token) {
  const url = `http://localhost:36912/browser/stop-profile`;

  try {
    const response = await axios.post(
      url,
      { profileId: profileId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to stop profile:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function createProfile(profileOptions) {
  try {
    const response = await axios.post(
      "https://api.gologin.com/browser/custom",
      profileOptions,
      {
        headers: {
          Authorization: `Bearer ${GOLOGIN_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Returns the created profile data
  } catch (error) {
    console.error(
      "❌ Failed to create profile:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function deleteGoLoginProfile(profileId, token) {
  const url = `https://api.gologin.com/browser/${profileId}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`Profile ${profileId} deleted successfully.`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed to delete profile ${profileId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

async function run(profile_id, user_data, token) {
  try {
    const wsUrl = await startGoLoginProfile(profile_id);

    const browser = await chromium.connectOverCDP(wsUrl);
    const context = browser.contexts()[0];

    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    console.log("> Go to page");
    await page.goto("https://meetdapper.com");
    console.log("> Page loaded");

    await page.click('a[data-tracker="home_startnow|home"]');
    console.log("> Pressed Create a Dapper wallet button");

    let result = undefined;
    try {
      result = await Promise.race([
        (async () => {
          await page.waitForFunction(
            () => document.title === "Not available in your area",
            { timeout: 60000 }
          );
          return "ip_bad";
        })(),
        (async () => {
          await page.click(".css-9sulzj");
          return "ip_good";
        })(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("⏰ Timeout after 60s")), 60000)
        ),
      ]);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }

    // Decide what to do based on result
    switch (result) {
      case "ip_good": {
        console.log("> Sign up button pressed, IP looks good.");
        break;
      }
      case "ip_bad": {
        console.log("🚫 IP is bad, stopping script.");
        await stopGoLoginProfile(profile_id, token);
        return false;
      }
      default: {
        console.warn("⚠️ Unknown result, or timeout occurred.");
        await stopGoLoginProfile(profile_id, token);
        return false;
      }
    }

    await page.fill(".css-1icy97x input[name='email']", user_data.email);
    await page.fill(".css-1icy97x input[name='password']", "qw09058222");
    await page.click("#signUp");

    const successSelector = ".accounts-1dmuaod";
    const errorSelector = ".css-euq7rx";

    const firstVisible = await Promise.race([
      page.waitForSelector(successSelector, { timeout: 60000 }),
      page.waitForSelector(errorSelector, { timeout: 60000 }),
    ]);

    if (await page.isVisible(successSelector)) {
      const username = await page.textContent(successSelector);
      console.log("✅ Account Created Successfully");
      console.log("Username:", username);
      console.log("Email:", user_data.email);
      console.log("Password: qw09058222");

      await appendToAccountFile(user_data.email);
    } else if (await page.isVisible(errorSelector)) {
      const errorMessage = await page.textContent(errorSelector);
      console.log("❌ Error:", errorMessage);
    } else {
      console.log("❌ Neither element appeared.");
    }

    // Fully close GoLogin profile/browser
    await stopGoLoginProfile(profile_id, token);

    console.log("---- PROFILE STOPPED ----");
    return true;
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

async function generate_user() {
  try {
    let user;

    while (true) {
      const response = await fetch("https://randomuser.me/api/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      user = data.results[0];

      // Check if the first and last names contain only English letters
      const isFirstNameValid = /^[A-Za-z]+$/.test(user.name.first);
      const isLastNameValid = /^[A-Za-z]+$/.test(user.name.last);

      if (isFirstNameValid && isLastNameValid) break; // Acceptable user found
    }

    let randomDigit = Math.floor(Math.random() * 9000) + 1000;
    user.email =
      `${user.name.first}.${user.name.last}${randomDigit}@gmail.com`.toLowerCase();

    return {
      firstName: user.name.first,
      lastName: user.name.last,
      email: user.email,
      username: user.login.username,
      password: user.login.password,
      gender: user.gender,
      country: user.location.country,
    };
  } catch (error) {
    console.error("❌ Failed to generate user:", error);
    return null;
  }
}

async function loadProxiesFromCSV(filePath) {
  const list_proxy = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        list_proxy.push(data.ipList); // or whatever the column name is
      })
      .on("end", () => {
        console.log("✅ CSV loaded.");
        resolve(list_proxy);
      })
      .on("error", (err) => {
        console.error("❌ CSV load error:", err.message);
        reject(err);
      });
  });
}

async function appendToAccountFile(text) {
  fs.appendFile("account.txt", `${text}\n`, "utf8", (err) => {
    if (err) {
      console.error("❌ Error appending to file:", err.message);
    } else {
      console.log("New account saved to account.txt");
    }
  });
}

// -----------
// -----------
// -----------
async function runTask() {
  let user_data = await generate_user();
  console.log(`🚀 Task ${user_data.firstName} ${user_data.lastName} started`);

  let os_options = ["win", "mac", "lin"];
  let os_selected = os_options[Math.floor(Math.random() * os_options.length)];

  const proxy_path = path.join("proxy.csv");
  const list_proxy = await loadProxiesFromCSV(proxy_path);
  const proxy_selected =
    list_proxy[Math.floor(Math.random() * list_proxy.length)];

  let browser_data = {
    os: os_selected,
    name: `${user_data.firstName} ${user_data.lastName}`,
    proxy: {
      mode: "http", // or "socks5", "socks4"
      host: "brd.superproxy.io",
      port: 33335,
      username: `brd-customer-hl_d2d93595-zone-datacenter_proxy1-ip-${proxy_selected}`, // optional
      password: "u7zj6g6jeea7", // optional
    },
  };
  let profile_data = await createProfile(browser_data);
  await run(profile_data.id, user_data, GOLOGIN_API_TOKEN);
  await deleteGoLoginProfile(profile_data.id, GOLOGIN_API_TOKEN);

  console.log(`Task ${user_data.firstName} ${user_data.lastName} finished`);
}

async function runMultipleTasks() {
  await Promise.all([runTask(), runTask()]);
}

(async () => {
  await runMultipleTasks();

  setInterval(() => {
    runMultipleTasks().catch((err) =>
      console.error("❌ Error in interval:", err)
    );
  }, 30 * 60 * 1000);
})();
