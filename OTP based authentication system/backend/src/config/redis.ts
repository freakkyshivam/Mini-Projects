import { createClient, RedisClientType } from "redis";

export const redis:RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err: Error) => {
  console.error("Redis error:", err);
});
(async ()=>{
await redis.connect();
})();

