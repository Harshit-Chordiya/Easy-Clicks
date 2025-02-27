import { LaunchBrowserTask } from '@/lib/workflow/task/LaunchBrowser';
import { PageToHtmlTask } from './PageToHtml';

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
};
