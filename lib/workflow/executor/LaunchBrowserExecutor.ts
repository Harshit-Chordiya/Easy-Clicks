import puppeteer from "puppeteer";
import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { env } from "process";

export async function LaunchBrowserExecutor(environment:ExecutionEnvironment): Promise<boolean> {
  try {
    const webisteUrl = environment.getInput("Website Url");
    console.log("website",webisteUrl);
    console.log("@@ENV",JSON.stringify(environment,null,4));
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
