import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import * as https from 'https';

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
    await page.goto(url, { timeout: 300000 });
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
      for (let attribute of trackTag?.attributes!) {
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

  private async getSubtitles(url: string) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        response.setEncoding('utf8');
        let responceBody = '';

        response.on('data', (chunk) => {
          responceBody += chunk;
        });

        response.on('end', () => {
          console.log('end', responceBody);
          resolve(responceBody);
        });
      });
      request.on('error', (err) => {
        reject(err);
      });
    });
  }

  async parse() {
    console.log('Получаю данные...');
    const htmlString = await this.parseFromUrl(this.url);
    if (!htmlString) {
      console.log('Не удалось получить данные');
      return;
    }
    console.log('Данные получены');
    const sources = this.createObjSources(htmlString);
    const subtitles = this.createObjSubtitle(htmlString);
    if (subtitles) {
      console.log('Получаю субтитры...');
      const subtitleVVT = await this.getSubtitles(subtitles.src);
      console.log('Субтитры получены');
      return { sources, subtitles, subtitleVVT };
    }
    return { sources };
  }
}
