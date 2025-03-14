import redis from "redis";

const redisConnect = async (redisClient) => {
  await redisClient
    .connect()
    .then((e) => console.log("Redis connected"))
    .catch((e) => console.log("Redis connection failed"));
};
export { redisConnect };
