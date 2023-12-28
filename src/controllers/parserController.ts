import { Request, Response } from 'express';
import { Parser } from '../models/Parser';
import { Room } from '../models/Room';

export const parserController = {
  getSourcesFromURL: async (req: Request, res: Response) => {
    const roomId = req.query.roomId as string;
    const url = req.query.url as string;
    if (!url) {
      res.status(400).send('Missing or invalid URL');
      return;
    }
    const parser = new Parser(url);
    try {
      const sources = await parser.parse();
      Room.setSources(roomId, sources);
      res.status(200).send(Room.getSources(roomId));
    } catch (error) {
      console.error('Error while parsing:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // downloadSubtitles: async (req: Request, res: Response) => {
  //   const url = req.query.url as string;
  //   if (!url) {
  //     res.status(400).send('Missing or invalid URL');
  //     return;
  //   }
  //   const parser = new Parser(url as string);
  //   try {
  //     const subtitleVVT = await parser.getSubtitles();
  //     res.status(200).send(subtitleVVT);
  //     console.log('Subtitles downloaded successfully');
  //   } catch (error) {
  //     console.error('Error while downloading subtitles:', error);
  //     res.status(500).send('Failed to download subtitles');
  //   }
  // },
};
