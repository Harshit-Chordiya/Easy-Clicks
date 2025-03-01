export const LogLevels = ["info", "error", "warning", "debug"] as const;

export type LogLevel = (typeof LogLevels)[number];
export type LogFunction = (message: string) => void;

export type Log = {
    message: string;
    level: LogLevel;
    timestamp: Date;
};

export type LogCollector = {
    getAll(): Log[];
} & {
    [key in LogLevel]: LogFunction;
};
