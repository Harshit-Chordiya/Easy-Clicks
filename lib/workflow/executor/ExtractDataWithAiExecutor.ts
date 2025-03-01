// import { ExecutionEnvironment } from "@/types/executor";
// import { ExtractDataWithAITask } from "../task/extract-data-with-ai";
// import prisma from "@/prisma/prisma";
// import { symmetricDecrypt } from "@/lib/encryption";
// import { OpenAI } from "openai";

// export async function ExtractDataWithAIExecutor(
//   environment: ExecutionEnvironment<typeof ExtractDataWithAITask>,
// ): Promise<boolean> {
//   try {
//     const credentials = environment.getInput("Credentials");
//     if (!credentials) {
//       environment.log.error("Credentials required");
//     }

//     const prompt = environment.getInput("Prompt");
//     if (!prompt) {
//       environment.log.error("Prompt required");
//     }

//     const content = environment.getInput("Content");
//     if (!content) {
//       environment.log.error("Content is required");
//     }

//     // Get credential from database
//     const credential = await prisma.credential.findUnique({
//       where: {
//         id: credentials,
//       },
//     });

//     if (!credential) {
//       environment.log.error("Credential not found");
//       return false;
//     }

//     const plainCredentialValue = symmetricDecrypt(credential.value);
//     if (!plainCredentialValue) {
//       environment.log.error("Failed to decrypt credential value");
//       return false;
//     }

//     // OpenAI Integration
//     const openai = new OpenAI({
//       apiKey: plainCredentialValue,
//     });

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.",
//         },
//         {
//           role: "user",
//           content: content,
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 1,
//       max_tokens: 1000,
//     });

//     console.log("OpenAI response:", response);

//     environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
//     environment.log.info(
//       `Completion tokens: ${response.usage?.completion_tokens}`,
//     );

//     const result = response.choices[0].message?.content;
//     if (!result) {
//       environment.log.error("Empty response from OpenAI");
//       return false;
//     }

//     environment.setOutput("Extracted data", result);

//     // This can be used in place of an AI service for testing purposes
//     // const mockExtractedData = {
//     //   usernameSelector: "#username",
//     //   passwordSelector: "#password",
//     //   loginSelector: "body > div > form > input.btn.btn-primary",
//     // };
//     // environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));

//     return true;
//   } catch (error: any) {
//     environment.log.error(error.message);
//     return false;
//   }
// }




import { ExecutionEnvironment } from "@/types/executor";

import { symmetricDecrypt } from "@/lib/encryption";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>,
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("Credentials required");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("Prompt required");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("Content is required");
      return false;
    }

    // Get credential from database
    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("Failed to decrypt credential value");
      return false;
    }

    // Gemini Integration
    const genAI = new GoogleGenerativeAI(plainCredentialValue);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.";

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 1000,
      }
    });

    const result = await chatSession.sendMessage(
      `${systemPrompt}\n\nContent: ${content}\n\nPrompt: ${prompt}`
    );

    const response = await result.response;
    const responseText = response.text();

    environment.log.info("Gemini request completed successfully");

    if (!responseText) {
      environment.log.error("Empty response from Gemini");
      return false;
    }

    environment.setOutput("Extracted data", responseText);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
