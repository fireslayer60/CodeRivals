import { redis } from "../redisClient.js";

const change_user = async ({ old_User, new_User }) => {
  try {
    const curSocketId = await redis.get(`socket:${old_User}`);
    
    if (curSocketId) {
      await redis.del(`socket:${old_User}`);
      await redis.set(`socket:${new_User}`, curSocketId);
      console.log(`Reassigned socket ${curSocketId} from ${old_User} to ${new_User}`);
    } else {
      console.warn(`No socket found for user ${old_User}`);
    }
  } catch (err) {
    console.error("Error in change_user:", err);
  }
};

export default change_user;
