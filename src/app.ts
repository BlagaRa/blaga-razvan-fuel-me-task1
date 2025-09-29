import { Bussiness } from "./bussiness/bussiness.js";
import { DataFetching } from "./fetch/fetch.js";
import type { CommentInterface } from "./interface/comment.js";
import type { Post } from "./interface/post.js";
import type { User } from "./interface/user.js";
import type { UserWithPosts } from "./interface/userWithPosts.js";
import { createLogger } from "./utility/createLogger.js";


class ReportGenerator{
    private users:User[]=[];
    private posts:Post[]=[];
    private usersWithPosts:UserWithPosts[]=[];

    private comments:CommentInterface[]=[];
    
    private loggerFetching=createLogger("DataFetching");
    private loggerProcessing=createLogger("Processing");

    //Injecting the dataFetching and bussiness like in the nestJs course
    constructor(private dataFetching:DataFetching,private bussiness:Bussiness){}

    public generateUserArray=async():Promise<void>=>{
        try {
            this.loggerFetching("Fetching users and posts and comments...");
            // this.users=await this.fetchUsers();
            // this.posts=await this.fetchPosts();
            // this.comments=await this.fetchComments();
            const{users,posts,comments}=await this.dataFetching.fetchAll();

            this.users=users;
            this.posts=posts;
            this.comments=comments;
            
            this.loggerProcessing("Combining every users with their posts...");
            const postWithComments=this.bussiness.combinePostsWithComments(this.posts,this.comments);
            this.posts=postWithComments;  

            this.usersWithPosts=this.bussiness.combineUsersWithPosts(this.users,this.posts);

            this.loggerProcessing("Combine every posts with their comments...")

            this.usersWithPosts.forEach(finalUserWithPosts=>{
                console.log(finalUserWithPosts.userId,finalUserWithPosts.email,finalUserWithPosts.name,finalUserWithPosts.username);
                finalUserWithPosts.posts.forEach(post=>{
                    console.log(post);
                })
            })

            console.log(`Number of iterations:${this.bussiness.counter}`);
            

            console.log("Success");
        } catch (error) {
            console.log(error);
        }
    }
}


const main=new ReportGenerator(new DataFetching("https://jsonplaceholder.typicode.com"),new Bussiness());
main.generateUserArray(); 