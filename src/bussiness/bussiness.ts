import type { CommentInterface } from "../interface/comment.js";
import type { Post } from "../interface/post.js";
import type { User } from "../interface/user.js";
import type { UserWithPosts } from "../interface/userWithPosts.js";
import type { PostComments } from "./interface/postComments.js";
import type { UserPosts } from "./interface/userPosts.js";

export class Bussiness{
    public counter=0;
    
    private commentsForPosts=(comments:CommentInterface[]):PostComments[]=>{
        const postComments:PostComments[]=[];
    
        for(let i=0;i<comments.length;i++){

            this.counter++;

            if(typeof postComments[comments[i]!.postId]==='undefined'){
                postComments[comments[i]!.postId]={comments:[]}
            }
    
            postComments[comments[i]!.postId]!.comments.push(comments[i]!);
        }
    
        return postComments;
        
    }
    
    //Here i am combining posts with comments
    public combinePostsWithComments=(posts:Post[],commentss:CommentInterface[]):Post[]=>{
        const comments=this.commentsForPosts(commentss);
    
        return posts.map(post=>{

            this.counter++;

            return{
                userId:post.userId,
                id:post.id,
                title:post.title,
                body:post.body,
                comments:comments[post.id]!.comments || []
            }
        })
    }
    private postsForUsers=(posts:Post[]):UserPosts[]=>{
        const userPosts:UserPosts[]=[];
        for(let i=0;i<posts.length;i++){

            this.counter++;

            if(typeof userPosts[posts[i]!.userId]==='undefined'){
                userPosts[posts[i]!.userId]={posts:[]};
            }

            userPosts[posts[i]!.userId]!.posts.push(posts[i]!);
        }
        return userPosts;
    }

    //Here i am combining the users with the posts
    public combineUsersWithPosts=(users:User[],postss:Post[]):UserWithPosts[]=>{
        try {
            const posts=this.postsForUsers(postss);
    
            return users.map(user=>{

                this.counter++;

                return {
                    userId:user.id,
                    username:user.username,
                    email:user.email,
                    name:user.name,
                    posts:posts[user.id]!.posts||[],
                }
            })
        } catch (error) {
            console.log("Error in combineUsersWithPosts");
            throw error;
        }
    }
    
}