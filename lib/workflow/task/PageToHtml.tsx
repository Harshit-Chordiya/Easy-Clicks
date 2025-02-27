import { TaskParamType, TaskType } from '@/types/task';
import { CodeIcon, GlobeIcon, LucideProps } from 'lucide-react';

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: 'Page to HTML',
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint:false,
  inputs: [
    {
    name: "Web Page",
    type: TaskParamType.BROWSER_INSTANCE,
    helperText: "The browser instance to use",
    required: true,

}],
outputs:[
  {name:"Html",type:TaskParamType.STRING},
  {name:"Web page",type:TaskParamType.BROWSER_INSTANCE},
],
   
};

