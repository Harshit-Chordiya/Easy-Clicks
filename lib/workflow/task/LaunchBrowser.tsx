import { TaskParamType, TaskType } from '@/types/task';
import { GlobeIcon, LucideProps } from 'lucide-react';

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: 'Launch browser',
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint:true,
  inputs: [
    {
    name: "Website URL",
    type: TaskParamType.STRING,
    helperText: "e.g., https://www.google.com",
    required: true,
    hideHandle: true,
}],
  
};

