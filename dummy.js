import puppeteer from "puppeteer";
import GoLogin from "gologin";
import fs from "fs";
import path from "path";

const image_1 = [
  "Every bet may balik—up to 3% cashback, kaya sulit bawat taya mo!",
  "Huwag palampasin ang chance na may cashback ka sa bawat laro, legit 'to!",
  "Sa SuperPH, kahit talo may balik! Up to 3% cashback guaranteed!",
  "Laro na sa SuperPH, kung saan kahit talo, may chance ka pa rin manalo!",
  "Real-time cashback? Oo, legit sa SuperPH—sulit na laro, may balik pa!",
  "Taya lang ng taya, may cashback ka pa rin kahit hindi tumama!",
  "G na G na ako sa SuperPH, may pa-cashback pa bawat laro!",
  "Laging may something pabalik sa SuperPH—taya ka na, siguradong sulit!",
  "Hindi sayang ang bet mo dito—may cashback ka agad kahit maliit!",
  "Try mo na SuperPH, real-time cashback kahit ilang ulit kang tumaya!",
  "Kahit chill betting lang, may reward ka pa rin—SuperPH got you!",
  "Sulit ‘yung laro pag may cashback, dito lang sa legit na SuperPH!",
  "Bet wisely, may cashback ka agad-agad—SuperPH ang sagot sa sulit!",
  "Dito sa SuperPH, every bet mo may bonus na cashback, di ka talo!",
  "Panalo kahit talo, basta may cashback—tara na sa SuperPH!",
  "San ka pa? Cashback agad-agad bawat laro, dito lang sa SuperPH!",
  "Hindi mo kailangang manalo lagi, kasi may cashback ka parin sa SuperPH!",
  "Tumataya ka na rin lang, sa may cashback ka na—SuperPH all the way!",
  "Laban lang kahit minsan talo, cashback will keep you going!",
  "Kahit pa small bets, may reward ka pa rin—thanks to SuperPH cashback!",
  "Para sa mga suki ng laro, cashback is the way—SuperPH delivers!",
  "Real-time cashback every bet—pang top-up na agad ‘yan!",
  "SuperPH gives you more reasons to bet—cashback is real!",
  "Legit na legit, kahit maliit ang taya mo, may cashback ka agad!",
  "Hindi bitin ang saya sa SuperPH—may dagdag pa through cashback!",
  "Every taya counts, dahil may cashback ka sa bawat isa—try mo na!",
  "Sulit na sugal kung may balik kahit konti—thanks SuperPH!",
  "Dito sa SuperPH, cashback feels like a small win kahit talo!",
  "Kaya mo ‘yan, kahit talo may consolation—up to 3% cashback!",
  "Hindi lang panalo ang rewarding, kahit talo may bonus sa SuperPH!",
  "Kung gusto mo ng extra sa bawat taya, try mo na SuperPH!",
  "Bet ka lang nang bet, kahit papano may bumabalik sa’yo!",
  "Para sa smart players, cashback is everything—SuperPH gets it done!",
  "Kahit hindi tumama ang spin mo, may bonus ka pa rin!",
  "Every click counts, lalo na pag may cashback—SuperPH never disappoints!",
  "Taya lang, every time may bumabalik—legit ‘to, guys!",
  "Taya mo, cashback mo—basta nasa SuperPH ka, panalo pa rin!",
  "Hindi mo na kailangang talunin ang swerte—may cashback ka naman!",
  "Halos hindi ka lugi, may cashback kang matatanggap bawat game!",
  "May taya ka ba? Dapat may cashback ka rin, sa SuperPH ‘yan!",
  "Kung maglaro ka rin lang, sa may balik sana—SuperPH ‘to!",
  "Bet ka, tapos may cashback pa—masarap balikan ‘to gabi-gabi!",
  "SuperPH ang sagot sa sulit na taya—may cashback, may saya!",
  "Game na game araw-araw, kasi every bet may bumabalik!",
  "Bawat click sa SuperPH, may reward—try mo to para malaman mo!",
  "Kaya gustong gusto ko SuperPH, kasi kahit talo may balik!",
  "G na G ka na ba? SuperPH may bonus pa para sa’yo!",
  "Sayang ‘pag hindi ka naglaro, may cashback ka pa naman dapat!",
  "Kakaibang laro ‘to, real-time cashback kahit paulit-ulit pa taya mo!",
  "Hindi lang laro, may instant reward pa—SuperPH para sa sulit moments!",
];

const image_2 = [
  "Log in every 7th, daming prizes naghihintay! SuperPH talaga ang the best!",
  "Huwag kalimutan tuwing 7th ng buwan—million cash at prizes ang naghihintay!",
  "Monthly rewards tuwing 7th, ‘di ka pa ba sasali? SuperPH lang ‘yan!",
  "Paalala lang, every 7th may pa-cash at prizes—log in na agad!",
  "Mga tropa, sabay-sabay tayo mag-log in every 7th, sure ang rewards!",
  "Sino ba naman ang ayaw sa prizes? Log in na every 7th sa SuperPH!",
  "Tuwing ikapito ng buwan, may pa-jackpot si SuperPH. Huwag mong palampasin!",
  "Tuloy-tuloy ang blessings tuwing 7th—SuperPH knows how to reward players!",
  "Monthly event alert! Don’t miss your chance to win big every 7th!",
  "Million-milyong papremyo sa 7th, isang log-in lang ang kailangan!",
  "Exciting ang bawat 7th ng buwan—SuperPH has something big for you!",
  "Free rewards? Log in lang every 7th at may chance ka na manalo!",
  "Ginto’t papremyo tuwing 7th! Maging parte ng kasiyahan sa SuperPH!",
  "7th of the month is reward time—log in at humabol sa millions!",
  "Walang talo tuwing 7th, basta SuperPH ang kasama mo!",
  "Don’t miss the monthly 7th login—grabe ang pa-premyo dito sa SuperPH!",
  "Isang beses sa isang buwan lang ‘to—log in every 7th for big prizes!",
  "Monthly rewards sa SuperPH, log-in lang every 7th, sulit ang panalo!",
  "SuperPH knows how to treat players—monthly rewards tuwing 7th, sulit na sulit!",
  "Kapag 7th na, alam mo na ‘yan—SuperPH rewards day na ulit!",
  "Mag-set ka na ng reminder, every 7th may blessings sa SuperPH!",
  "Buwan-buwan may chance ka—just log in tuwing 7th ng buwan!",
  "Sayang kung makakalimutan mo ‘to—log in tuwing 7th, sure rewards!",
  "Hindi lang laro, may pa-monthly rewards pa tuwing 7th—dito lang sa SuperPH!",
  "Kahit minsan ka lang maglaro, basta 7th log-in, pwede ka na manalo!",
  "Libreng cash at prizes tuwing 7th—SuperPH talagang galante!",
  "Mag-log in lang every 7th, millions of prizes na ang kapalit!",
  "Laro at rewards sa isang app—SuperPH tuwing 7th, masayang araw ‘yan!",
  "Hindi mo kailangang gumastos—log in lang tuwing 7th for a chance to win!",
  "Sama-sama tayo every 7th, baka ikaw na ang next winner!",
  "Huwag kang pahuli—log in on the 7th para sa special rewards ng SuperPH!",
  "Kung naghahanap ka ng papremyo, tuwing 7th ka na maglog-in!",
  "Buwan-buwan may pa-surpresa ang SuperPH—i-calendar mo na ang 7th!",
  "7th of the month = payday sa SuperPH. Log in and claim yours!",
  "Sino ba naman ang ayaw sa monthly prizes? SuperPH got you covered tuwing 7th!",
  "Baka ito na ‘yung sign mo—log in sa 7th, baka ikaw na!",
  "Monthly event tuwing 7th ng buwan, daming nananalo—ikaw na kaya next?",
  "7th ng buwan, araw ng swerte sa SuperPH—sayang kung di mo subukan!",
  "Million ang naghihintay sa'yo tuwing 7th, log in na sa SuperPH!",
  "May pa-gold, cash, at prizes—tuwing 7th lang ‘yan, only at SuperPH!",
  "Log in for a shot at millions—SuperPH rewards await tuwing 7th!",
  "SuperPH monthly treats—isang log in lang tuwing 7th, jackpot agad!",
  "Excited na ako every 7th—may pa-premyo kasi si SuperPH!",
  "Kahit di ka regular player, basta 7th log-in mo, may chance ka na!",
  "SuperPH rewards every 7th, kaya dapat alerto ka palagi!",
  "Buwan-buwan may panalo, log in tuwing 7th para kasama ka!",
  "Libreng chance manalo ng cash at prizes? Gawin mo ‘yan tuwing 7th!",
  "Hindi lang swerte, effort din—pero sa SuperPH, isang log in lang!",
  "Simple lang, log in every 7th para sa chance na makasama sa winners!",
  "Buwanang bigayan ng blessings tuwing 7th—SuperPH talaga ang sagot diyan!",
  "7th of the month? That’s your lucky day with SuperPH monthly rewards!",
];

const images_data = [
  {
    captions: image_1,
    image_path: "image_1.jpg",
  },
  {
    captions: image_2,
    image_path: "image_2.jpg",
  },
];

const random_image_data =
  images_data[Math.floor(Math.random() * images_data.length)];
const image_path = "poster_images";

const full_image_path = path.join(image_path, random_image_data.image_path);

const caption_one =
  random_image_data.captions[
    Math.floor(Math.random() * random_image_data.captions.length)
  ];
const caption_two =
  random_image_data.captions[
    Math.floor(Math.random() * random_image_data.captions.length)
  ];

let caption_final = `${caption_one} ${caption_two}`;

const { connect } = puppeteer;

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODFkNjhlMWJhNWMwYjRmNzEzYTc0MjUiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2ODFkNzIxZWIyOGJkYWUxMGJlYmE0MTcifQ._uAoUtLqpVhCSq3lsA2wtPEaM6QiyW36j4nbZoBowSc";

const accounts = [
  {
    browser_id: "681da38c978d29f08fa26d49",
  },
];

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

  const { status, wsUrl } = await GL.start().catch((e) => {
    console.trace(e);
    return { status: "failure" };
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
  // -------------------
  // -------------------

  let page_link = "https://www.facebook.com/groups/superphfb1";

  const page = await browser.newPage();
  await page.goto(page_link, { waitUntil: "domcontentloaded" });

  // OPENNG MODAL
  let open_post_modal_sltr = `.x1i10hfl.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x16tdsg8.x1hl2dhg.xggy1nq.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.xmjcpbm.x107yiy2.xv8uw2v.x1tfwpuw.x2g32xy.x78zum5.x1q0g3np.x1iyjqo2.x1nhvcw1.x1n2onr6.xt7dq6l.x1ba4aug.x1y1aw1k.xn6708d.xwib8y2.x1ye3gou`;
  await page.waitForSelector(open_post_modal_sltr);
  await page.click(open_post_modal_sltr);

  await delay(1000);

  let modal = ".xt7dq6l.x1a2a7pz.x6ikm8r.x10wlt62.x1n2onr6.x14atkfc";
  await page.waitForSelector(`${modal} input.x1s85apg`);

  // CHOOSE AND UPLOAD IMAGE
  const file_input = await page.$(`${modal} input.x1s85apg`);
  await file_input.uploadFile(full_image_path);

  // TYPE POST
  const modal_header =
    ".x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1120s5i";
  await page.click(modal_header);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  // ACTUAL TYPING
  await page.keyboard.type("Lucky Link Bonus 188Php");
  await page.keyboard.down("Shift");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Link: https://bit.ly/Claim_Bonus_L");
  await page.keyboard.down("Shift");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");

  // caption here
  await page.keyboard.type(caption_final);

  // await page.keyboard.type(`${caption_post_one} ${caption_post_two}`);

  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.keyboard.type(
    "#Superph #Superphcasino #Superphonlinecasino #onlinecasino #casinogames #bonus #jackpot #bet #superace #bingo #megaball #colorgame #blackjack #lottery #tongits #pusoy #livegames #scatter #trending #viral #beautiful #followers #love "
  );

  let emoji_button_selector = `${modal} .xr9ek0c.xfs2ol5.xjpr12u.x12mruv9:nth-child(4) .x6s0dn4.x78zum5.xl56j7k.x1n2onr6.x5yr21d.xh8yej3`;
  await page.click(emoji_button_selector);

  let activities_button_selector = `${modal} .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x18d9i69.x6s0dn4.x9f619:nth-child(2)`;
  await page.waitForSelector(activities_button_selector);
  await page.click(activities_button_selector);

  await delay(1000);

  let playing_search_selector = `${modal} .x1i10hfl.xggy1nq.xtpw4lu.x1tutvks.x1s3xk63.x1s07b3s.x1kdt53j.x1yc453h.xhb22t3.xb5gni.xcj1dhv.x2s2ed0.xq33zhf.xjbqb8w.xnwf7zb.x40j3uw.x1s7lred.x15gyhx8.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xzsf02u.xdl72j9.x1iyjqo2.xs83m0k.xjb2p0i.x6prxxf.xeuugli.x1a2a7pz.x1n2onr6.xdvlbce.xsyo7zv.x16hj40l.xm7lytj.xc9qbxq.xtilpmw.x1ad04t7.x1glnyev.x1ix68h3.x19gujb8`;
  await page.waitForSelector(playing_search_selector, { visible: true });
  await page.focus(playing_search_selector);
  await page.keyboard.type("playing");

  await page.waitForSelector(
    `${modal} .x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.x1qughib.x6s0dn4.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj`
  );

  await page.evaluate((modal) => {
    const selector = `${modal} .x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.x1qughib.x6s0dn4.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj`;
    const button = document.querySelector(selector);
    if (button) {
      button.click();
    } else {
      console.warn("Button not found");
    }
  }, modal);

  const modal_header_playing = `${modal} .x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj h2`;
  await page.waitForSelector(modal_header_playing);
  await page.click(modal_header_playing);

  let activity_name_selector = `${modal} .x1i10hfl.xggy1nq.xtpw4lu.x1tutvks.x1s3xk63.x1s07b3s.x1kdt53j.x1yc453h.xhb22t3.xb5gni.xcj1dhv.x2s2ed0.xq33zhf.xjbqb8w.xnwf7zb.x40j3uw.x1s7lred.x15gyhx8.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xzsf02u.xdl72j9.x1iyjqo2.xs83m0k.xjb2p0i.x6prxxf.xeuugli.x1a2a7pz.x1n2onr6.xdvlbce.xsyo7zv.x16hj40l.xm7lytj.xc9qbxq.xtilpmw.x1ad04t7.x1glnyev.x1ix68h3.x19gujb8`;
  await page.waitForSelector(activity_name_selector, { visible: true });
  await page.focus(activity_name_selector);
  await page.keyboard.type("SUPERPH.net");

  await page.waitForSelector(
    `${modal} .x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.x1qughib.x6s0dn4.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj`
  );

  await page.evaluate((modal) => {
    const selector = `${modal} .x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.x1qughib.x6s0dn4.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj`;
    const button = document.querySelector(selector);
    if (button) {
      button.click();
    } else {
      console.warn("Button not found");
    }
  }, modal);

  await delay(2000);

  let post_button_selector = `.xt7dq6l.x1a2a7pz.x6ikm8r.x10wlt62.x1n2onr6.x14atkfc > div > div > div > div > div:nth-child(3) .x1i10hfl.xjbqb8w.x1ejq31n`;
  // await page.click(post_button_selector);

  await new Promise((resolve) => setTimeout(resolve, 500000));

  //
  //
  //
  // 681dd8b0541dda9bfcdc4f1f
  //
  //
  //
  //

  // List of options
  const list_options =
    ".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.x10b6aqq.x1yrsyyn";
  await page.waitForSelector(list_options);

  const elements = await page.$$(list_options);

  const like_button_element = elements[0];
  const share_button_element = elements[2];

  // Query "div" inside each
  const like_div = await like_button_element.$("div");
  const share_div = await share_button_element.$("div");

  // Optional: click or inspect
  await like_div.click();
  console.log("[CF POST] Like button clicked");
  await delay(5000);
  await share_div.click();
  console.log("[CF POST] Open share modal");

  const share_modal =
    ".x1n2onr6.x1ja2u2z.x1afcbsf.xdt5ytf.x1a2a7pz.x71s49j.x1qjc9v5.xrjkcco.x58fqnu.x1mh14rs.xfkwgsy.x78zum5.x1plvlek.xryxfnj.xcatxm7.x1n7qst7.xh8yej3";
  const share_button =
    share_modal + " " + ".x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft";

  console.log("[CF POST] Waiting for share modal to appear...");
  await delay(10000);

  await page.click(share_button);
  console.log("[CF POST] Share button clicked");

  console.log("[CF POST] Sharing ...");
  await delay(10000);

  //
  //
  //
  //

  const profile_page = await browser.newPage();
  console.log("[Facebook Profile] Opening profile page...");

  const devices = [
    {
      name: "iPhone 14 Pro Max",
      width: 430,
      height: 932,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3,
    },
    {
      name: "Samsung Galaxy S22",
      width: 412,
      height: 915,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3.5,
    },
    {
      name: "Pixel 7 Pro",
      width: 412,
      height: 892,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2.75,
    },
    {
      name: "iPhone SE (2022)",
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
    {
      name: 'iPad Pro 12.9"',
      width: 1024,
      height: 1366,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
    {
      name: "Samsung Galaxy Tab S8",
      width: 800,
      height: 1280,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
    {
      name: "iPhone 13 Mini",
      width: 375,
      height: 812,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3,
    },
    {
      name: "OnePlus 10 Pro",
      width: 412,
      height: 915,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2.75,
    },
    {
      name: "iPad Mini (6th Gen)",
      width: 768,
      height: 1024,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
    {
      name: "Google Nexus 7 (2013)",
      width: 600,
      height: 960,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
  ];

  const randomDevice = devices[Math.floor(Math.random() * devices.length)];

  // Set viewport to the selected device
  await page.setViewport({
    width: randomDevice.width,
    height: randomDevice.height,
    isMobile: randomDevice.isMobile,
    hasTouch: randomDevice.hasTouch,
    deviceScaleFactor: randomDevice.deviceScaleFactor,
  });

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      await profile_page.goto("https://www.facebook.com/profile.php", {
        waitUntil: "domcontentloaded",
        timeout: 15000, // optional: control timeout per try
      });
      console.log("[Facebook Profile] Page loaded successfully.");
      break; // success, exit loop
    } catch (err) {
      attempts++;
      console.warn(`Attempt ${attempts} failed: ${err.message}`);
      if (attempts >= maxAttempts) {
        console.error("Failed to load page after multiple attempts.");
        throw err;
      }
    }
  }

  const latest_post = ".x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z";
  await profile_page.waitForSelector(latest_post);

  await profile_page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY + rect.top - 150;
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    } else {
      console.warn("Element not found:", selector);
    }
  }, latest_post);

  console.log("[Facebook Profile] Scrolling to latest post...");
  console.log("[Facebook Profile] Waiting for latest post to load");
  await delay(10000);

  // Take a screenshot and save it
  await profile_page.screenshot({
    path: path.join(screenshotFolder, `${PROFILE_NAME}_img.png`), // Save the screenshot in the "screenshot" folder
  });

  console.log("[Facebook Profile] Screenshot taken");
  profile_page.close();
  console.log("[Facebook Profile] Closing profile page");

  await delay(2000);

  // Wait for file input dialog to appear and upload the image
  await page.waitForSelector('input[type="file"]');
  const fileInput = await page.$('input[type="file"]'); // Get the file input element
  await fileInput.uploadFile(`screenshot/${PROFILE_NAME}_img.png`); // Upload the image

  console.log("[CF POST] Image being uploaded");
  await delay(10000);

  // Step 1: Define the selector for the comment box
  const commentBoxSelector =
    'div[aria-label="Write a comment…"][contenteditable="true"]';

  // Step 2: Wait for the comment box to appear
  await page.waitForSelector(commentBoxSelector);

  // Step 3: Focus the comment box
  const commentBox = await page.$(commentBoxSelector);
  await commentBox.click();

  // Step 4: Type the comment
  await page.keyboard.type("IGN: TC.666");
  await page.keyboard.down("Shift");
  await page.keyboard.press("Enter");
  await page.keyboard.up("Shift");
  await page.keyboard.type("#NEWGARNETSKYBORNBEAST");
  await page.keyboard.down("Shift");
  await page.keyboard.press("Enter");
  await page.keyboard.up("Shift");
  await page.keyboard.type("#CROSSFIREPH");

  console.log("[CF POST] Commenting...");

  let comment_button =
    ".x1ey2m1c.xds687c.x17qophe.xg01cxk.x47corl.x10l6tqk.x13vifvy.x1ebt8du.x19991ni.x1dhq9h.xzolkzo.x12go9s9.x1rnf11y.xprq8jg";

  await page.evaluate((comment_button) => {
    const containers = document.querySelectorAll(
      ".x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x1qughib.x6s0dn4.x1a02dak.x1q0g3np.x1pi30zi.x1swvt13.xykv574.xbmpl8g.x4cne27.xifccgj > div"
    );

    if (containers.length > 1) {
      const commentBtn = containers[1].querySelector(comment_button);
      if (commentBtn) {
        commentBtn.click();
        console.log("[CF POST] Comment has been submitted.");
      } else {
        console.warn("Comment button not found.");
      }
    } else {
      console.warn("Target container not found.");
    }
  }, comment_button);

  console.log("[SYSTEM] Closing in 20 seconds");

  await delay(20000);
  await closeResources(page, browser, GL);
}

async function processAccountsWithDelay(data) {
  for (const profile of data) {
    console.log(profile.id);
    console.log(profile.name);
    await login(profile.id, profile.name);
    await new Promise((resolve) => setTimeout(resolve, 500000000));
  }
}

async function closeResources(page, browser, GL) {
  try {
    if (page) await page.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (browser) await browser.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (GL) await GL.stop();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    console.error("Error closing resources:", err);
  }
}
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
processAccountsWithDelay(data.profiles);
