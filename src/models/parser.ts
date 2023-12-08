import puppeteer from 'puppeteer';
const { JSDOM } = require('jsdom');

export class Parser {
  private url: string;
  private urlParser: URL;
  constructor(url: string) {
    this.url = url;
    this.urlParser = new URL(url);
  }

  private async parseFromUrl(url: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('video[src]');
    const result = await page.evaluate(() => {
      return document.querySelector('video[src]')?.outerHTML;
    });
    await browser.close();
    return result;
  }
  private createObjSources(htmlString: string) {
    try {
      const dom = new JSDOM(htmlString);
      const sourceTags = dom.window.document.querySelectorAll('source');

      const sourceArray = Array.from(sourceTags).map((tag: any) => {
        const attributesObj: any = {};
        for (let attribute of tag.attributes) {
          attributesObj[attribute.name] = attribute.value;
        }
        return attributesObj;
      });

      return sourceArray;
    } catch (error) {
      console.log('Видео не найдены');
    }
  }
  private createObjSubtitle(htmlString: string) {
    try {
      const dom = new JSDOM(htmlString);
      const trackTag = dom.window.document.querySelector('track');

      const attributesObj: any = {};
      for (let attribute of trackTag.attributes) {
        attributesObj[attribute.name] = attribute.value;
      }
      if (!attributesObj.src.includes('https')) {
        const { src, ...attrs } = attributesObj;
        return { ...attrs, src: 'https://' + this.urlParser.hostname + attributesObj.src };
      }
      return attributesObj;
    } catch (error) {
      console.log('Субтитры не найдены');
    }
  }

  async parse() {
    const htmlString = await this.parseFromUrl(this.url);
    if (!htmlString) {
      console.log('Не удалось получить данные');
      return;
    }
    const sourses = this.createObjSources(htmlString);
    const subtitles = this.createObjSubtitle(htmlString);
    return { sourses, subtitles };
  }
}
