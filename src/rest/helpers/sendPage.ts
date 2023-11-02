import { Response } from "express";
import { sendData } from "./sendData";

type Page = {
  docs: any[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export function sendPage(res: Response, page: Page | Promise<Page>) {
  Promise.resolve(page).then((data) => {
    sendData(res, {
      items: data.docs || [],
      itemsPerPage: data.limit || 0,
      pageNumber: data.page || 0,
      totalItems: data.totalDocs || 0,
      totalPages: data.totalPages || 0,
    });
  });
}
