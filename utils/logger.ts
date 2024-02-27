// import pino, { LoggerOptions } from "pino";
// import dayjs from "dayjs";
// import * as prettyPrint from "pino-pretty";

// // Define a custom LoggerOptions interface that includes prettyPrint
// interface CustomLoggerOptions extends LoggerOptions {
//   prettyPrint?: {
//     colorize?: boolean;
//     ignore?: string;
//     translateTime?: string;
//     formatter?: typeof prettyPrint;
//   };
// }

// const log = pino({
//   prettyPrint: {
//     colorize: true,
//     ignore: "pid,hostname",
//     translateTime: "SYS:standard",
//     formatter: prettyPrint,
//   },
//   base: {
//     pid: false,
//   },
//   timestamp: () => `,"time":"${dayjs().format()}"`,
// } as CustomLoggerOptions);

// export default log;
