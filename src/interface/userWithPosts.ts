import type { Post } from "./post.js";

//Interface For UsersWithPosts
export interface UserWithPosts{
    userId:number,
    name:string,
    username:string,
    email:string,
    posts:Post[] 
}