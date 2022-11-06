import { connect } from "../deps.ts";

const redisClient = await connect({
  hostname: "localhost",
  port: 6379,
});

console.log("🚀 Redis connected successfully");

export default redisClient;
