import { ExecutionEnvironment } from "@/types/executor";
import * as cheerio from "cheerio";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>,
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector is required");
      return false;
    }

    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html is required");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error(`Selector "${selector}" not found in HTML`);
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error(`No text found in element "${selector}"`);
      return false;
    }

    environment.setOutput("Extracted text", extractedText);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
