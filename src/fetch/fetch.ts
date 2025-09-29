import type { CommentInterface } from "../interface/comment.js";
import type { Post } from "../interface/post.js";
import type { User } from "../interface/user.js";


export class DataFetching{
    private baseUrl;
    constructor(baseUrl:string){
        this.baseUrl=baseUrl;
    }
    private fetchData=async<T>(url:string):Promise<T>=>{
        try {
            const res=await fetch(this.baseUrl+url);

            if(!res.ok){
                throw new Error("HTTP error");
            }

            const data:T=await res.json();
            return data;
        } catch (error) {
            console.log("error in fetchData");
            throw error;
        }
    }
    public fetchUsers=async():Promise<User[]>=>{
        try {
            return await this.fetchData<User[]>("/users");  
        } catch (error) {
            throw error;
            
        }
    }
    
    public fetchPosts=async():Promise<Post[]>=>{
        try {
            return await this.fetchData<Post[]>("/posts");  
        } catch (error) {
            throw error;
        }
    }
    
    public fetchComments=async():Promise<CommentInterface[]>=>{
        try {
            return this.fetchData<CommentInterface[]>("/comments");
        } catch (error) {
            throw error;
        }
    }
    
    //Fetch All to respect the question with promiseAll
    public fetchAll=async()=>{
        try {
    
            const [users,posts,comments]=await Promise.all([
                this.fetchData<User[]>("/users"),
                this.fetchData<Post[]>("/posts"),
                this.fetchData<CommentInterface[]>("/comments"),
            ])
    
            return {users,posts,comments};
    
        } catch (error) {
            throw error;
        }
    }
}
