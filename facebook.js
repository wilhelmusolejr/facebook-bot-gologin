import path from "path";
import fs from "fs";
import { spawn } from "child_process";

import { delay } from "./helper_function.js";

const file = fs.createWriteStream("/test.webm");

async function startRecording(outputPath) {
  const ffmpeg = spawn("ffmpeg", [
    "-y",
    "-f",
    "gdigrab",
    "-framerate",
    "30",
    "-i",
    "title=dosam84864@chobler.com - MySpecialTab",
    "-video_size",
    "1280x720",
    "-codec:v",
    "libx264",
    "-preset",
    "ultrafast",
    "recording.mp4",
  ]);

  ffmpeg.stderr.on("data", (data) => {
    console.log(`[FFmpeg] ${data}`);
  });

  ffmpeg.on("close", (code) => {
    console.log(`[FFmpeg] Recording finished with code ${code}`);
  });

  return ffmpeg;
}

export async function scroll_feed(browser) {
  let max_attept = 3;
  const ACTION_NAME = `SCROLL FEED`;
  const page_link = "https://www.facebook.com/";
  const posts_parent = `.x1hc1fzr.x1unhpq9.x6o7n8i`;

  const pages = await browser.pages();
  const page = pages[0]; // use the first tab
  await page.bringToFront();

  // Set viewport size to screen dimensions
  await page.setViewport({ width: 1920, height: 1080 });

  // Force the browser window to move and resize
  await page.evaluate(() => {
    window.moveTo(0, 0);
    window.resizeTo(screen.width, screen.height);
  });

  for (let attempt = 1; attempt <= max_attept; attempt++) {
    try {
      console.log(`[${ACTION_NAME}] START START START`);

      await page.goto(page_link, { waitUntil: "domcontentloaded" });
      console.log(`[${ACTION_NAME}] Page loaded ...`);

      await page.waitForSelector(posts_parent);

      // await page.evaluate(() => {
      //   document.title = "MySpecialTab";
      // });

      // await delay(10000);

      // const videoPath = path.resolve("recording.mp4");
      // const ffmpeg = await startRecording(videoPath);

      let posts_list = await page.$$(
        `${posts_parent} div.x1lliihq:not([class*=" "])`
      );

      while (posts_list.length < 10) {
        const scroll_delay = Math.floor(Math.random() * 5) + 1;
        await delay(scroll_delay * 1000);
        await page.mouse.wheel({ deltaY: 500 });

        posts_list = await page.$$(
          `${posts_parent} div.x1lliihq:not([class*=" "])`
        );
      }

      console.log(`[${ACTION_NAME}] Found ${posts_list.length} posts`);
      console.log(`[${ACTION_NAME}] Looping each post start`);

      for (const post of posts_list) {
        let isPostCanInteract = await post.$("div[aria-label='Like']");

        if (!isPostCanInteract) {
          console.log(`[${ACTION_NAME}] Post is not interactable, skipping.`);
          continue;
        }

        console.log(`[${ACTION_NAME}] Found target post!`);

        let share_button = await post.$(
          `div[aria-label="Send this to friends or post it on your profile."]`
        );

        console.log(`[${ACTION_NAME}] Scrolling to the target post`);
        // Scroll into view before clicking
        await isPostCanInteract.evaluate((el) =>
          el.scrollIntoView({ behavior: "smooth", block: "center" })
        );

        await delay(500); // allow scroll to finish

        try {
          await isPostCanInteract.click();
          console.log(`[${ACTION_NAME}] Like button clicked`);
        } catch (error) {
          console.log(`[${ACTION_NAME}] ATTEMPT TO LIKE BUT ERROR`, error);
        }

        await delay(500);

        try {
          await share_button.click();
          console.log(`[${ACTION_NAME}] Share button clicked`);

          let modal_selector = `.x1n2onr6.x1ja2u2z.x1afcbsf.xdt5ytf.x1a2a7pz.x71s49j.x1qjc9v5.xrjkcco.x58fqnu.x1mh14rs.xfkwgsy.x78zum5.x1plvlek.xryxfnj.xcatxm7.x1n7qst7.xh8yej3`;
          await page.waitForSelector(modal_selector);
          console.log(`[${ACTION_NAME}] Share modal opened`);

          await page.waitForSelector(
            `${modal_selector} div[aria-label="Share now"]`
          );
          await page.click(`${modal_selector} div[aria-label="Share now"]`);

          await delay(8000);

          console.log(`[${ACTION_NAME}] Target post has been shared.`);
        } catch (error) {
          console.log(`[${ACTION_NAME}] ATTEMPT TO SHARE BUT ERROR`, error);
        }

        console.log(`[${ACTION_NAME}] DONE DONE DONE`);

        // ffmpeg.stdin.write("q"); // Gracefully stop recording

        await page.close();

        break;
      }

      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === max_attept) {
        console.error("All retries failed.");
      } else {
        console.log("Retrying...");
      }
    }
  }
}

export async function post_group(browser) {
  let max_attept = 3;
  const ACTION_NAME = `GROUP POST`;
  let page_link = "https://www.facebook.com/groups/superphfb1";

  const page = await browser.newPage();

  // DATA
  // DATA
  // DATA
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

  const image_3 = [
    "Laro lang nang laro sa slot, fish, at poker—may bonus ka pa!",
    "Mas malaki panalo mo, mas malaki bonus sa SuperPH!",
    "Naglaro lang ako ng slot, may reward pa agad. Try mo rin!",
    "Slot, fish, poker—saan ka pa? Dito may dagdag reward talaga!",
    "Gusto mo ng bonus? Maglaro ka ng poker, fish, or slot games!",
    "Panalo ka na sa laro, may bonus reward ka pa? SuperPH lang ‘yan!",
    "May chance ka na manalo, may dagdag bonus pa. Laro na!",
    "Mas maraming laro, mas maraming bonus—SuperPH na ang sagot!",
    "Lagi akong may reward sa slot at fish game. Swabe!",
    "Walang talo sa SuperPH, panalo na may bonus pa!",
    "Kahit chill play lang, may reward ka pa. Try mo sa SuperPH!",
    "Sarap maglaro kapag alam mong may bonus reward kang makukuha!",
    "Kahit maliit ang taya, may dagdag bonus pa rin. Lodi SuperPH!",
    "Paborito ko na ang fish game, lagi akong may pa-bonus!",
    "Bet lang ng bet, may bonus reward din sa dulo!",
    "Sulit ang oras sa poker, may extra reward every play!",
    "Hindi lang panalo, pati bonus binibigay—legit sa SuperPH!",
    "Laro ka na sa slot at fish, daming bonus nakakatuwa!",
    "Bet ka lang ng bet, may rewards din kahit di palaging panalo!",
    "Pinaka-rewarding na games ang slot at fish, sa SuperPH pa!",
    "Masarap maglaro kapag alam mong may bonus na babalik sa ‘yo!",
    "SuperPH always gives more, lalo sa slot at poker games!",
    "Bawat laro sa SuperPH, may chance ka sa bonus rewards!",
    "Paborito ng tropa ang poker—daming panalo, daming rewards!",
    "Grabe sa bonus ang SuperPH. Slot pa lang panalo na!",
    "Fish game sa SuperPH? Panalo + bonus = sulit ang laro!",
    "Bored? Laro ka muna ng poker sa SuperPH, may bonus pa!",
    "Gustong manalo? Dito ka na sa slot, may reward pa lagi!",
    "Pinaka-enjoy ako sa fish game—kakaibang saya at rewards!",
    "Basta sa SuperPH, win or lose may reward ka pa rin!",
    "Naglaro lang ako ng slot tapos may dagdag pa akong nakuha!",
    "Naka-jackpot ka na, may bonus ka pa—san ka pa?!",
    "Bonus dito, bonus doon. Basta sa slot, fish, and poker!",
    "Masarap laruin lalo na kapag may reward kang inaabangan!",
    "Nasa SuperPH ang tunay na rewards. Subok mo na?",
    "Mas madaming laro, mas madaming reward—SuperPH talaga!",
    "Win big and get more! Laruin na ang slot, fish at poker!",
    "Bonus kahit walang panalo? Ganyan sa SuperPH!",
    "Naglaro lang ako sa SuperPH, nagulat ako may bonus reward pa!",
    "Slot game na may bonus? Ayos sa SuperPH!",
    "Try mo mag-fish game dito, nakakaaliw at may bonus pa!",
    "Sa poker pa lang, bawi ka na agad—may bonus pa!",
    "Hindi lang para sa panalo, para rin sa rewards ang SuperPH!",
    "Bawat spin sa slot, may chance sa bonus reward!",
    "Panalo ka na, may bonus ka pa—grabe sa SuperPH!",
    "Dito lang ako nakakalaro na parang may kasamang swerteng reward!",
    "Big win agad sa slot! Bonus pa? Lodi na talaga!",
    "Hindi ko akalaing may bonus reward din after playing poker!",
    "Bawat laro parang may balik, salamat sa SuperPH bonus!",
    "Try mo lang isang beses, malulunod ka sa bonus rewards!",
    "Paborito ng barkada ang slot kasi laging may extra reward!",
  ];

  const image_4 = [
    "Araw-araw may pa-angpao basta naka-log in ka ng 10PM to 10:30PM!",
    "Gabi-gabi may surprise reward! Don’t forget to log in on time!",
    "Saktong 10PM? Log-in agad para sa libreng angpao!",
    "Minsan lang ‘to—log in sa tamang oras para may free reward!",
    "Sino bang ayaw ng free? Basta 10PM pasok ka sa pa-angpao!",
    "Free angpao daily? Basta umabot ka ng 22:00-22:30!",
    "Nag-log in lang ako ng gabi, may reward agad. Legit!",
    "10PM alarm ko na para sa SuperPH angpao!",
    "Simple lang—log in at may angpao ka araw-araw!",
    "Late ka na? Sayang angpao, dapat 10PM sharp!",
    "Libreng reward tuwing gabi, sinong di sasali?",
    "Dahil sa SuperPH, gabi-gabi akong may reward!",
    "Every night na to routine ko—log in then claim!",
    "Ang saya ng gabi kapag may free angpao kang inaabangan!",
    "Grabe, kahit di ka maglaro may pa-reward!",
    "Minsan kailangan mo lang magpakita para sa freebie!",
    "Pampa-goodnight ang libreng angpao, thank you SuperPH!",
    "Bitin ang gabi kung walang pa-angpao!",
    "Lahat ng tropa online tuwing 10PM, angpao gang kami!",
    "Tamang log-in lang, may cash reward ka na agad!",
    "Reward na di mo na kailangan habulin—log-in lang!",
    "Kahit busy sa araw, basta gabi naka-online ako!",
    "Walang effort masyado—log-in and claim lang!",
    "Daily reward? Edi mag-log in ka gabi-gabi!",
    "SuperPH knows how to treat players well—freebies lagi!",
    "Naka-set na reminder ko para sa daily angpao!",
    "Huwag palampasin ang 10PM, libreng reward yan!",
    "Sa oras lang ang usapan, may reward ka na agad!",
    "Sarap maging active tuwing 10PM sa SuperPH!",
    "Gabi-gabi may reward? Pasok na pasok ‘yan sa akin!",
    "Legit may pa-angpao, kahit walang taya!",
    "Pampa-saya ng gabi, free reward mula SuperPH!",
    "Paborito kong oras na ang 10PM—reward time!",
    "Dito lang ako nakakakuha ng daily reward kahit wala akong taya!",
    "Masarap ang tulog ‘pag may nakuha kang reward bago matulog!",
    "Panalo ka na sa gabi pa lang!",
    "SuperPH: log-in lang, may papremyo agad!",
    "Nag-log in lang ako, hindi ko inakala may reward!",
    "Ang pinaka-chill na reward—walang laro, log-in lang!",
    "Parang attendance lang pero may bayad—astig!",
    "Di mo na kailangang maglaro, magpakita ka lang!",
    "Paborito ko ‘to sa lahat ng promo—walang effort!",
    "Kung ganito lang lahat ng app, araw-araw akong present!",
    "Tamang log-in, tamang swerte!",
    "Kahit busy, 10PM priority ko na ‘to!",
    "Tara, log-in tayo sabay sabay sa 10PM!",
    "Di na kailangang sugalan, log-in lang panalo!",
    "Kahit mabilis lang, may pa-bonus agad!",
    "Tamang oras, tamang reward—SuperPH talaga!",
    "Huwag sayangin ang chance, angpao gabi-gabi!",
    "Dito lang ako nakakakuha ng reward habang nanonood ng Netflix!",
  ];

  const image_5 = [
    "Mas maraming taya, mas maraming bonus—try mo na!",
    "Bet lang nang bet sa slot, fish & poker—may reward yan!",
    "Dito lang panalo kahit talo—may bonus pa rin!",
    "Kung mahilig ka sa slot, fish, or poker—perfect ‘to sayo!",
    "Lahat ng laro may reward? Jackpot ‘to!",
    "Every bet counts—kaya i-all in mo na!",
    "Tuloy lang ang laro, tuloy din ang bonus!",
    "Kahit maliit ang taya, may balik pa rin!",
    "Paborito ko talaga ‘tong slot games—lalo na’t may bonus!",
    "Tamang laro, tamang reward!",
    "Bonus sa bawat spin? Saan ka pa?",
    "Slot, fish & poker players, ito na ang para sa inyo!",
    "Di ka lang nage-enjoy—kumakabig ka pa ng bonus!",
    "Paikutin mo lang yan—may reward kang aabangan!",
    "Kahit talo, may pa-bonus si SuperPH!",
    "Taya lang nang taya, parang walang talo!",
    "Ang saya sa slot! May thrill na, may reward pa!",
    "Lahat ng taya mo, bumabalik bilang bonus!",
    "Ito na ang sign mo—ituloy mo na ang laro!",
    "More games, more bonus! Simpleng equation lang yan!",
    "May thrill sa fish, saya sa poker, bonus sa lahat!",
    "Triple treat: slot, fish, at poker rewards!",
    "Di mo na kailangang manalo para may bonus!",
    "Parang cashback sa bawat bet—sulit!",
    "Slot, fish, poker—lahat panalo!",
    "Habang nag-eenjoy ka, may pabalik ka rin!",
    "Hindi lang swerte—may reward ka ring sure!",
    "Bawat taya, may kaakibat na pa-surprise!",
    "Bet mo ba maglaro? Bet ka rin ni SuperPH!",
    "Panalo talaga sa fish game, kahit bonus lang habol mo!",
    "Paborito ko yung poker—lalo na pag may reward after!",
    "Spin mo lang ng spin—may something ka lagi!",
    "Para sa lahat ng adik sa laro—bonus awaits!",
    "Kahit pampalipas-oras lang, may bonus pa rin!",
    "Walang tapon na taya—lahat may kapalit!",
    "Laruin mo lang yan, si SuperPH na bahala sa reward!",
    "Mas masaya maglaro pag alam mong may bonus!",
    "Hindi mo kailangang manalo para makuha ang reward!",
    "Sa bawat laro, may chance kang mabigyan ng bonus!",
    "Bet responsibly pero enjoy the rewards!",
    "Fish game lover? Mas mapapamahal ka dito!",
    "Kahit chill play lang, sure bonus ka pa rin!",
    "Ang saya ng poker pag may bonus sa dulo!",
    "Every bet is worth it with SuperPH!",
    "Sana all, kahit taya lang may kapalit na bonus!",
    "Mas malaki ang laro, mas malaki ang chance sa reward!",
    "Bet today, reward later!",
    "Kahit anong laro ang trip mo, may bonus para sayo!",
    "Walang talo pag may pa-bonus sa dulo!",
    "Level up ang thrill pag may reward na kasama!",
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
    {
      captions: image_3,
      image_path: "image_3.jpg",
    },
    {
      captions: image_4,
      image_path: "image_4.jpg",
    },
    {
      captions: image_5,
      image_path: "image_5.jpg",
    },
  ];

  // -------------------
  // -------------------
  // -------------------
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

  for (let attempt = 1; attempt <= max_attept; attempt++) {
    try {
      console.log(`[${ACTION_NAME}] START START START`);

      await page.goto(page_link, { waitUntil: "domcontentloaded" });
      console.log(`[${ACTION_NAME}] Page loaded ...`);

      // OPENNG MODAL
      console.log(`[${ACTION_NAME}] Waiting for post modal element`);
      let open_post_modal_sltr = `.x1i10hfl.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x16tdsg8.x1hl2dhg.xggy1nq.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.xmjcpbm.x107yiy2.xv8uw2v.x1tfwpuw.x2g32xy.x78zum5.x1q0g3np.x1iyjqo2.x1nhvcw1.x1n2onr6.xt7dq6l.x1ba4aug.x1y1aw1k.xn6708d.xwib8y2.x1ye3gou`;
      await page.waitForSelector(open_post_modal_sltr);
      await page.click(open_post_modal_sltr);

      console.log(`[${ACTION_NAME}] Post modal opened`);
      await delay(1000);

      let modal = ".xt7dq6l.x1a2a7pz.x6ikm8r.x10wlt62.x1n2onr6.x14atkfc";
      await page.waitForSelector(`${modal} input.x1s85apg`);

      // CHOOSE AND UPLOAD IMAGE
      const file_input = await page.$(`${modal} input.x1s85apg`);
      await file_input.uploadFile(full_image_path);
      console.log(`[${ACTION_NAME}] Image has been selected`);

      // TYPE POST
      console.log(`[${ACTION_NAME}] Typing post description`);
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

      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await page.keyboard.type(
        "#Superph #Superphcasino #Superphonlinecasino #onlinecasino #casinogames #bonus #jackpot #bet #superace #bingo #megaball #colorgame #blackjack #lottery #tongits #pusoy #livegames #scatter #trending #viral #beautiful #followers #love "
      );

      console.log(`[${ACTION_NAME}] Done typing post description`);

      await delay(1000);

      let emoji_button_selector = `${modal} .xr9ek0c.xfs2ol5.xjpr12u.x12mruv9:nth-child(4) .x6s0dn4.x78zum5.xl56j7k.x1n2onr6.x5yr21d.xh8yej3`;
      await page.click(emoji_button_selector);

      await delay(1000);

      let activities_button_selector = `${modal} .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x18d9i69.x6s0dn4.x9f619:nth-child(2)`;
      await page.waitForSelector(activities_button_selector);
      await page.click(activities_button_selector);

      await delay(2000);

      let playing_search_selector = `${modal} input[placeholder="Search"]`;
      await page.waitForSelector(playing_search_selector, { visible: true });
      await page.focus(playing_search_selector);
      await page.keyboard.type("playing");

      console.log(`[${ACTION_NAME}] Setting post activity PLAYING`);

      await page.waitForSelector(
        `${modal} .x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.x1qughib.x6s0dn4.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj`
      );

      await delay(1000);

      await page.evaluate((modal) => {
        const selector = `${modal} .x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.x1qughib.x6s0dn4.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj`;
        const button = document.querySelector(selector);
        if (button) {
          button.click();
        } else {
          console.warn("Button not found");
        }
      }, modal);

      await delay(1000);

      const modal_header_playing = `${modal} .x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj h2`;
      await page.waitForSelector(modal_header_playing);
      await page.click(modal_header_playing);

      await delay(2000);

      let activity_name_selector = `${modal} input[placeholder="Search"]`;
      await page.waitForSelector(activity_name_selector, { visible: true });
      await page.focus(activity_name_selector);
      await page.keyboard.type("SuperPh");

      console.log(`[${ACTION_NAME}] Setting post activity SUPERPH.net`);

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

      let post_button_selector = `${modal} > div > div > div > div > div > div:nth-child(3) .x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x87ps6o.x1lku1pv.x1a2a7pz.x9f619.x3nfvp2.xdt5ytf.xl56j7k.x1n2onr6.xh8yej3`;
      await page.click(post_button_selector);

      await delay(10000);
      console.log(`[${ACTION_NAME}] Posted`);
      console.log(`[${ACTION_NAME}] DONE DONE DONE`);

      if (page) await page.close();

      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === max_attept) {
        console.error("All retries failed.");
      } else {
        console.log("Retrying...");
      }
    }
  }
}

export async function join_group(browser) {
  const max_attempt = 3;
  const ACTION_NAME = `JOIN GROUP`;
  let page_link = "https://www.facebook.com/groups/discover";

  console.log(`[${ACTION_NAME}] START START START`);

  const page = await browser.newPage();

  for (let attempt = 1; attempt <= max_attempt; attempt++) {
    try {
      await page.goto(page_link, { waitUntil: "domcontentloaded" });
      console.log(`[${ACTION_NAME}] Page loaded ...`);

      await page.mouse.wheel({ deltaY: 500 });
      await delay(1000);
      await page.mouse.wheel({ deltaY: 500 });
      await delay(1000);
      await page.mouse.wheel({ deltaY: 500 });

      let group_card_selector =
        ".x9f619.x1r8uery.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6";
      await page.waitForSelector(group_card_selector);
      await page.waitForSelector(
        `${group_card_selector} div[aria-label='Join group']`
      );
      await page.click(`${group_card_selector} div[aria-label='Join group']`);

      await delay(10000);

      console.log(`[${ACTION_NAME}] Join group successfully`);
      console.log(`[${ACTION_NAME}] DONE DONE DONE`);

      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === max_attempt) {
        console.error("All retries failed.");
      } else {
        console.log("Retrying...");
      }
    }
  }
}

export async function search(browser) {
  const max_attempt = 3;
  const ACTION_NAME = `SEARCH`;
  let page_link = "https://www.facebook.com/";

  console.log(`[${ACTION_NAME}] START START START`);

  const names = [
    "Liam",
    "Olivia",
    "Noah",
    "Emma",
    "Aiden",
    "Sophia",
    "Jackson",
    "Ava",
    "Lucas",
    "Isabella",
    "Mason",
    "Mia",
    "Ethan",
    "Charlotte",
    "Logan",
    "Amelia",
    "James",
    "Harper",
    "Benjamin",
    "Evelyn",
  ];

  for (let attempt = 1; attempt <= max_attempt; attempt++) {
    try {
      const randomName = names[Math.floor(Math.random() * names.length)];

      const page = await browser.newPage();
      await page.goto(page_link, { waitUntil: "domcontentloaded" });
      console.log(`[${ACTION_NAME}] Page loaded ...`);

      const search_input_selector = `input[aria-label='Search Facebook']`;
      await page.waitForSelector(search_input_selector);
      await page.focus(search_input_selector);
      await page.keyboard.type(randomName);
      await delay(1000);
      await page.keyboard.press("Enter");

      console.log(`[${ACTION_NAME}] Will search `, randomName);

      const profiles_list = `.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x1iyjqo2.x2lwn1j`;
      await page.waitForSelector(profiles_list);

      await delay(5000);

      const profiles_list_element = await page.$$(
        `${profiles_list} .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w`
      );

      console.log("People found", profiles_list_element.length);
      console.log(
        `[${ACTION_NAME}] Checking list of profiles that can be added`
      );

      for (const profile of profiles_list_element) {
        let isAddable = await profile.$(`div[aria-label="Add friend"]`);

        if (!isAddable) {
          console.log(`[${ACTION_NAME}] Profile is not addable`);
          continue;
        }
        console.log(`[${ACTION_NAME}] Found target profile`);

        await isAddable.click();
        console.log(`[${ACTION_NAME}] Added as a friend clicked...`);
        break;
      }

      console.log(`[${ACTION_NAME}] DONE DONE DONE`);

      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === max_attempt) {
        console.error("All retries failed.");
      } else {
        console.log("Retrying...");
      }
    }
  }
}

export async function post_on_profile(browser) {
  let max_attempt = 3;
  const ACTION_NAME = "POST PROFILE";
  let page_link = "https://www.facebook.com/";

  const page = await browser.newPage();

  const facebookPosts = [
    "Why do mirrors seem like portals when it's 3 AM?",
    "Somebody said ghosts can read thoughts. I hope they’re not judging mine.",
    "Motivation tip: Even ghosts had to die before they became legends.",
    "Why do I remember things I never lived?",
    "If Mondays were a horror movie, I'd be the first one to die.",
    "Do ants ever sleep, or are they just grinding 24/7?",
    "Be the reason someone randomly smiles at their phone today.",
    "The voices in my head said this would be a good idea.",
    "I tried to adult today. Failed. Retrying tomorrow.",
    "Zombies would be so disappointed by my brain.",
    "If the floor creaks at 2 AM, I just pretend it’s a friendly ghost checking in.",
    "Spilled coffee, forgot my keys, stepped in gum. My villain origin story begins.",
    "If time is money, I’ve been broke since birth.",
    "Your shadow is proof the light is always nearby.",
    "Laughed at a meme so hard I forgot I was sad. Internet therapy, 100%.",
    "I just sneezed and scared my cat. We’re not talking right now.",
    "There’s a monster under my bed. We’ve reached a mutual agreement.",
    "I'm not saying I believe in ghosts, but I keep the lights on. Just in case.",
    "Be careful who you ghost… some spirits hold grudges.",
    "I dreamed I was chasing myself. I don’t trust that version of me.",
    "Never forget, your brain named itself.",
    "I accidentally told Alexa I loved her. She hasn’t responded.",
    "Smile. It confuses people.",
    "Some say I have a resting witch face. I take it as a compliment.",
    "Why is the word 'abbreviation' so long?",
    "Imagine your future self watching you scroll right now.",
    "Woke up at 3:33 AM. Stayed awake just in case it was a test.",
    "That awkward moment when your reflection doesn’t wave back.",
    "My imaginary friend ghosted me. Literally.",
    "Don’t follow me. I’m lost too.",
    "Even my echo ignores me.",
    "I put the ‘pro’ in procrastination.",
    "Every scar tells a story. Mine says: 'don’t touch the oven.'",
    "Dear brain, stop replaying that embarrassing moment from 2009. Thanks.",
    "I told my plants about you. They said you better water them.",
    "The moon knows all your secrets. Especially when you cry at 1 AM.",
    "Haunted houses? Please. My browser history is scarier.",
    "Motivation isn’t real. Coffee is.",
    "I stared into the abyss. It winked back.",
    "Was I supposed to be doing something productive right now?",
    "Ghosts don’t scare me. People do.",
    "The cake is a lie. But I ate it anyway.",
    "Fun fact: I’ve never seen myself blink.",
    "Feeling cute. Might summon a demon later.",
    "Your phone knows more about you than your parents.",
    "I love long walks… especially when they're away from responsibilities.",
    "Don’t text your ex. Text yourself. Heal.",
    "There’s probably a parallel universe where I’m rich and well-rested.",
    "Aliens exist. They just don’t want to deal with our nonsense.",
    "If you think you’re being watched, you probably are. Smile.",
    "Life is short. Buy the haunted mirror.",
    "Sometimes I open the fridge for comfort. Not food. Just light and silence.",
    "Don’t judge me. My playlist is emotionally unstable.",
    "I write horror stories. They're called 'job applications.'",
    "My confidence is held together with caffeine and sarcasm.",
    "Remember: Clowns are just people with unresolved issues and face paint.",
    "Came here to vibe. Got haunted instead.",
    "I'm not lazy. I'm energy-efficient.",
    "Behind every happy photo is a dead phone battery.",
    "The monster under my bed charges rent now.",
    "Every time I clean, I find stuff I forgot I lost. It’s like archaeology.",
    "Who needs horror movies when you remember something cringe at 2 AM?",
    "Smile. It makes people wonder what you’re up to.",
    "The internet never sleeps. So why should I?",
    "In an alternate reality, I'm doing yoga on a beach. In this one, I'm in bed again.",
    "Don't worry, the ghosts in your room are friendly. Probably.",
    "Woke up feeling productive. So I went back to bed before it got worse.",
    "Keep your standards high and your snacks closer.",
    "Never trust a spider that disappears. It’s plotting.",
    "I downloaded a meditation app and fell asleep during the tutorial.",
    "Don’t worry, you’re not alone. There’s someone behind you. 😉",
    "Even my alarm clock is tired of me.",
    "Reality called, but I didn’t answer.",
    "Do skeletons ever get cold?",
    "Be so positive, even your shadow glows.",
    "Midnight thoughts hit harder than coffee.",
    "That awkward silence when you’re alone in a haunted room.",
    "Remember: The WiFi is faster than your ghosts.",
    "I laughed at my problems. They laughed back.",
    "Today’s to-do list: survive, vibe, repeat.",
    "If something touches your foot while you sleep, it wasn’t the blanket.",
    "Some mirrors hold memories. Be careful what you say in front of them.",
    "I'm not ignoring you. I just forgot you existed temporarily.",
    "Mood: Like a cat with WiFi access.",
    "What's worse than stepping on Lego? Real life.",
    "If I had a dollar for every awkward moment… I'd still be broke but entertained.",
    "You ever just walk into a room and forget why you’re haunted?",
    "The only thing I chase is sleep.",
    "Note to self: ghosts don’t pay rent, but anxiety does.",
    "Is it weird to miss someone you never met?",
    "Don’t feed the demons after midnight. Trust me.",
    "I’m not weird. I’m limited edition.",
    "This post will self-destruct in 5 seconds. Or not. I’m lazy.",
    "When in doubt, blame the spirits.",
    "Be kind. Even to the invisible ones.",
    "I wish calories were ghosts — invisible and irrelevant.",
    "Never argue with a shadow. You’ll lose.",
    "Ran into my ex’s ghost. Still annoying.",
    "I didn’t choose the creepy life. It followed me.",
    "Whatever you do, don’t look behind you after reading this post.",
  ];

  console.log(`[${ACTION_NAME}] START START START`);

  for (let attempt = 1; attempt <= max_attempt; attempt++) {
    try {
      await page.goto(page_link, { waitUntil: "domcontentloaded" });
      console.log(`[${ACTION_NAME}] Page loaded ...`);

      // OPENNG MODAL
      console.log(`[${ACTION_NAME}] Waiting for post modal element`);
      let open_post_modal_sltr = `.x1i10hfl.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x16tdsg8.x1hl2dhg.xggy1nq.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.xmjcpbm.x107yiy2.xv8uw2v.x1tfwpuw.x2g32xy.x78zum5.x1q0g3np.x1iyjqo2.x1nhvcw1.x1n2onr6.xt7dq6l.x1ba4aug.x1y1aw1k.xn6708d.xwib8y2.x1ye3gou`;
      await page.waitForSelector(open_post_modal_sltr);
      await page.click(open_post_modal_sltr);

      console.log(`[${ACTION_NAME}] Post modal opened`);
      await delay(1000);

      let modal = ".xt7dq6l.x1a2a7pz.x6ikm8r.x10wlt62.x1n2onr6.x14atkfc";

      // TYPE POST
      console.log(`[${ACTION_NAME}] Typing post description`);
      const modal_header = `${modal} .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1120s5i`;
      await page.click(modal_header);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // ACTUAL TYPING
      const randomPostSelected =
        facebookPosts[Math.floor(Math.random() * facebookPosts.length)];

      await page.keyboard.type(randomPostSelected);
      console.log(`[${ACTION_NAME}] Done typing post description`);

      let post_button_selector = `${modal} div[aria-label="Post"]`;
      await page.click(post_button_selector);

      console.log(`[${ACTION_NAME}] POSTED`);
      console.log(`[${ACTION_NAME}] DONE DONE DONE`);

      await delay(10000);

      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === max_attempt) {
        console.error("All retries failed.");
      } else {
        console.log("Retrying...");
      }
    }
  }
}

export async function set_up(browser) {
  const page = await browser.newPage();
  try {
    let page_link = "https://www.facebook.com/groups/superphfb1";
    await page.goto(page_link, { waitUntil: "domcontentloaded" });

    let options = `.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.x13a6bvl.x6s0dn4.xozqiw3.x1q0g3np.xcud41i.x139jcc6.x4vbgl9.x1rdy4ex`;
    await page.waitForSelector(options);
    await page.waitForSelector(`${options} div[aria-label="Join group"]`);
    await page.click(`${options} div[aria-label="Join group"]`);

    await delay(5000);

    console.log("Joined group");
  } catch (error) {
    console.log("already a member");
  }
}
