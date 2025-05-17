import { getSystemErrorMap } from "util";
import { redis } from "../redisClient.js";

const change_user = ({old_User,new_User})=>{
    const curSoicketId= redis.get(`socket:${old_User}`);
    redis.del(`socket:${old_User}`);
    console.log(old_User);
    redis.set(`socket:${new_User}`,curSoicketId);
} 

export default change_user;