import { setupUser } from "@/actions/billing/setupUser";

export default async function SetupPage() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return await setupUser();
}
