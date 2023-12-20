import {  Request, Response } from 'express';
import { Parser } from '../models/Parser';


export const parserController = {
  getSourcesFromURL: async (req: Request, res: Response) => {
    const parser = new Parser(req.body.url);
    const sources = await parser.parse();
    res.status(200).send(sources);
  },
};
