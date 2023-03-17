const cheerio = require("cheerio");

const sleep = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, (seconds || 1) * 1000));

const puppeteer = require("puppeteer");

const getRecommendation = async (url, count, cookies =  []) => {
  const browser = await puppeteer.launch({
    headless: false, // Launch in non-headless mode
    slowMo: 50, // Slow down the automation by 50ms per step
    args: ["--window-size=1920,1080"],
  });

  const page = await browser.newPage();
  if(cookies.length){
    await page.setCookie(...cookies);
  }
  await page.setViewport({
    width: 1720,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.goto(url);

  // Wait for the recommended videos to load
  const selector = await page.waitForSelector("ytd-compact-video-renderer");

  let recommendedCount = 0;
  while (recommendedCount < count) {
    // Scroll to the bottom of the page to load more recommended videos
    await page.evaluate(() => {
      const elements = document.querySelectorAll("ytd-compact-video-renderer");
      if (elements.length) {
        elements[elements.length - 1].scrollIntoView();
      } else {
        window.scrollBy(0, window.innerHeight * 2);
      }
    });
    await sleep(2);
    // Wait for the new recommended videos to load
    await page.waitForFunction(
      (prevCount) => {
        const currCount = document.querySelectorAll(
          "ytd-compact-video-renderer"
        ).length;
        return currCount > prevCount;
      },
      {},
      recommendedCount
    );

    recommendedCount = await page.evaluate(() => {
      return document.querySelectorAll("ytd-compact-video-renderer").length;
    });
  }

  let html = await page.content();
  const $ = cheerio.load(html);

  const values = [];
  $("ytd-compact-video-renderer").each((i, link) => {
    values.push({
      link: $(link).find("#thumbnail").attr("href"),
      thumbnail: $(link).find("yt-image img").attr("src"),
      duration: $(link)
        .find("ytd-thumbnail-overlay-time-status-renderer span")
        .text()
        .trim(),
      title: $(link).find("#video-title").text().trim(),
      channel: $(link)
        .find("ytd-channel-name #container #text-container yt-formatted-string")
        .text(),
      views: $(link).find("#metadata-line:nth-child(2) span:nth-child(3)").text(),
      uploadedAt: $(link).find("#metadata-line:nth-child(2) span:nth-child(4)").text(),
      verified: !!$(link).find("ytd-badge-supported-renderer"),
    });
  });

  await browser.close();
  return values.map((value, i) => ({ ...value, position: i + 1 }));
};

module.exports = {
  getRecommendation,
};
