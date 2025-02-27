export enum TaskType{
    LAUNCH_BROWSER="LAUNCH_BROWSER",
}


export enum TaskParamType{
    STRING="STRING",
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    [key: string]: any;
  }
  