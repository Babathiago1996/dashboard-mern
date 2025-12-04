import "dotenv/config";
import "./queues/emailQueue.js";

console.log("Email worker started. Listening for jobs...");
setInterval(() => {}, 1000);
