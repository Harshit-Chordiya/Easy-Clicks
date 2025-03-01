import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>,
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector is required");
    }

    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("Visibility is required");
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });

    environment.log.info(`Element ${selector} set to: ${visibility}`);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
