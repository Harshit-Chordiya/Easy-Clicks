import { LaunchBrowserTask } from '@/lib/workflow/task/LaunchBrowser';
import { PageToHtmlTask } from './PageToHtml';
import { ExtractTextFromElementTask } from './ExtractTextFromElement';

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
