import { Browser } from 'puppeteer'

export type Environment = {
  browser?: Browser;
  phases: Record<
    string,
    {
      inputs: Record<string, string> 
      outputs: Record<string, string>
    }
  >
};
   export type ExecutionEnvironment = {
    getInput(name:string):string;
}
