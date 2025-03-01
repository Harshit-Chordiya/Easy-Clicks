import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>,
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("Target URL is required");
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("Body is required");
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Failed to deliver via webhook: ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(
      `Delivered via webhook: ${JSON.stringify(responseBody)}`,
    );

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
