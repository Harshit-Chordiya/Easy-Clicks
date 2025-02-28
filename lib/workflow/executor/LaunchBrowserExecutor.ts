import puppeteer from "puppeteer";
import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { env } from "process";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(environment:ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
  try {
    const webisteUrl = environment.getInput("Website URL");
    console.log("website",webisteUrl);
    const browser = await puppeteer.launch({
      headless: false, 
    });

    await waitFor(3000);

    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
