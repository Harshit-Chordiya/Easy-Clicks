import { Loader2Icon } from "lucide-react";

function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2Icon size={30} className="animate-spin stroke-primary" />
    </div>
  );
}

export default Loading;