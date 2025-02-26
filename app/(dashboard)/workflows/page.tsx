
import { Skeleton } from "@/components/ui/skeleton";
import React,{Suspense} from "react";
import { Alert,AlertDescription,AlertTitle } from "@/components/ui/alert";
import { getWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { AlertCircle, InboxIcon } from "lucide-react";
function Page() {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workflows</h1>
            <p>Your workflows</p>
          </div>
        </div>
        <div className="h-full py-6">
          <Suspense fallback={<UserWorkflowsSkeleton />}>
            <UserWorkflows />
          </Suspense>
        </div>
      </div>
    );
  }
  
  function UserWorkflowsSkeleton() {
    return (
      <div className="space-y-2">
        {[1,2,3,4].map((i)=>(<Skeleton key={i} className="h-32 w-full" />
    ))}
        
      </div>
    );
  }
  
  async function UserWorkflows() {
    const workflows = await getWorkflowsForUser();
  
    if (!workflows) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (workflows.length === 0) {
        return (
          <div className="flex flex-col gap-4 h-full items-center justify-center">
            <div className="bg-accent w-20 h-20 flex items-center justify-center rounded-full">
              <InboxIcon size={40} className="stroke-purple-600" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No workflow created yet</p>
              <p className="text-sm text-muted-foreground">
                Click the button below to create your first workflow
              </p>
            </div>
          </div>
        );
      }
  
    return <div></div>;
  }

  export default Page;
  