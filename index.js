const pw = require('playwright');
async function main() {
  const browser = await pw.chromium.launch({
    headless: true,
  });
  const page = await browser.newPage({
    bypassCSP: true,
  });
  await page.goto('https://github.com/topics/javascript');
  await page.click('text=Load more');
  await page.waitForFunction(() => {
    const repoCards = document.querySelectorAll('article.border');
    return repoCards.length > 30;
  });
  //   await page.waitForTimeout(10000);
  const repos = await page.$$eval('article.border', (repoCards) => {
    return repoCards.map((card) => {
      const [user, repo] = card.querySelectorAll('h3 a');
      const stars = card.querySelector('a.social-count');
      const description = card.querySelector('div.px-3 > p + div');
      const topics = card.querySelectorAll('a.topic-tag');
      const toText = (element) => element && element.innerText.trim();

      return {
        user: toText(user),
        repo: toText(repo),
        url: repo.href,
        stars: toText(stars),
        description: toText(description),
        topics: Array.from(topics).map((t) => toText(t)),
      };
    });
  });
  console.log(`We extracted ${repos.length} repositories`);
  console.dir(repos);
  await browser.close;
}

main();
