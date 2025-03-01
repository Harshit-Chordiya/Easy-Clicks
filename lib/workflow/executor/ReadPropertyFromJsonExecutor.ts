import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>,
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("JSON is required");
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("Property name is required");
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];
    if (!propertyValue) {
      environment.log.error(`Property "${propertyName}" not found in JSON`);
      return false;
    }

    environment.setOutput("Property value", propertyValue);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
