import type { CommentInterface } from "./comment.js";

//Interface For Posts
export interface Post{
    userId:number,
    id:number,
    title:string,
    body:string,
    comments:CommentInterface[]
}