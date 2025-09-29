//Interface For Users
interface User{
    id:number,
    name:string,
    username:string,
    email:string,
    
}

//Interface For Posts
interface Post{
    userId:number,
    id:number,
    title:string,
    body:string,
    comments:Comment[]
}

//Interface For UsersWithPosts
interface UserWithPosts{
    userId:number,
    name:string,
    username:string,
    email:string,
    posts:Post[] 
}

//Interface for Comments
interface Comment{
    postId:number,
    id:number,
    name:string,
    body:string
}

//The clouser function for loggers
function createLogger(context:string){
    function loggingFunction(message:string){
        console.log(`[${context}] ${message}`)
    }
    return loggingFunction;
}

//Interface for making the array for Posts and to put the index for each users
interface UserPosts{
    posts:Post[]
}


//Interface for making the array Comments and to asign to the index of Posts
interface PostComments{
    comments:Comment[];
}

//Interface for asigning Posts With comments to the array with the index userId
interface UserPostsWithComments{
    postsWithComments:Post[];
}

class ReportGenerator{
    private users:User[]=[];
    private posts:Post[]=[];
    private usersWithPosts:UserWithPosts[]=[];

    private comments:Comment[]=[];

    //Counter to count the iterations and to make sure i am not making the same mistakes with loop in loop
    private count=0;
    
    private loggerFetching=createLogger("DataFetching");
    private loggerProcessing=createLogger("Processing");

    private fetchData=async<T>(url:string):Promise<T>=>{
        try {
            const res=await fetch(url);

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

    //I have separated the fetching functions just to be easier to extend without modifications in other functions
    private fetchUsers=async():Promise<User[]>=>{
        try {
            return await this.fetchData<User[]>("https://jsonplaceholder.typicode.com/users");  
        } catch (error) {
            throw error;
            
        }
    }

    private fetchPosts=async():Promise<Post[]>=>{
        try {
            return await this.fetchData<Post[]>("https://jsonplaceholder.typicode.com/posts");  
        } catch (error) {
            throw error;
        }
    }

    private fetchComments=async():Promise<Comment[]>=>{
        try {
            return this.fetchData<Comment[]>("https://jsonplaceholder.typicode.com/comments");
        } catch (error) {
            throw error;
        }
    }

    //Fetch All to respect the question with promiseAll
    private fetchAll=async()=>{
        try {
            this.count++;

            const [users,posts,comments]=await Promise.all([
                this.fetchData<User[]>("https://jsonplaceholder.typicode.com/users"),
                this.fetchData<Post[]>("https://jsonplaceholder.typicode.com/posts"),
                this.fetchData<Comment[]>("https://jsonplaceholder.typicode.com/comments"),
            ])

            this.users=users;
            this.posts=posts;
            this.comments=comments;

        } catch (error) {
            throw error;
        }
    }

    //This is the function that i will
    //  call in combineUsersWithPosts to be 
    // able to asign the posts in 10 iterations 
    // throw the users and not needing to make 100
    //  iterrations for each users
    //I am using ! because typescript thinks that everithing can be undefined
    private postsForUsers=(posts:Post[]):UserPosts[]=>{
        const userPosts:UserPosts[]=[];
        for(let i=0;i<posts.length;i++){
            this.count++;
            if(typeof userPosts[posts[i]!.userId]==='undefined'){
                userPosts[posts[i]!.userId]={posts:[]};
            }
            userPosts[posts[i]!.userId]!.posts.push(posts[i]!);
        }
        return userPosts;
    }

    //Same this as the upper function but for Posts With comments
    private commentsForPosts=(comments:Comment[]):PostComments[]=>{
        const postComments:PostComments[]=[];

        for(let i=0;i<comments.length;i++){
            this.count++;

            if(typeof postComments[comments[i]!.postId]==='undefined'){
                postComments[comments[i]!.postId]={comments:[]}
            }

            postComments[comments[i]!.postId]!.comments.push(comments[i]!);
        }

        return postComments;
        
    }

    //Here i am combining the users with the posts
    private combineUsersWithPosts=(users:User[]):UserWithPosts[]=>{
        try {
            const posts=this.postsForUsers(this.posts);

            return users.map(user=>{
                this.count++;

                return {
                    userId:user.id,
                    username:user.username,
                    email:user.email,
                    name:user.name,
                    posts:posts[user.id]!.posts||[]
                }
            })
        } catch (error) {
            console.log("Error in combineUsersWithPosts");
            throw error;
        }
    }

    //Here i am combining posts with comments
    private combinePostsWithComments=(posts:Post[]):Post[]=>{
        const comments=this.commentsForPosts(this.comments);

        return posts.map(post=>{
            this.count++;
            return{
                userId:post.userId,
                id:post.id,
                title:post.title,
                body:post.body,
                comments:comments[post.id]!.comments || []
            }
        })
    }

    //This is the same function as commetsForPosts and postsForUsers
    //I had to put the userId inside Posts With comments to have a foreign key to be able to reach UsersWithPosts 
    private forUsersWithPostsWithComments=(postsWithComments:Post[]):UserPostsWithComments[]=>{
        const userPostsWithComments:UserPostsWithComments[]=[];

        for(let i=0;i<postsWithComments.length;i++){
            this.count++;
            const postWithComments=postsWithComments[i]!;

            if(typeof userPostsWithComments[postWithComments.userId]==='undefined'){
                userPostsWithComments[postWithComments.userId]={postsWithComments:[]}
            }

            userPostsWithComments[postWithComments.userId]?.postsWithComments.push(postWithComments);
        }

        return userPostsWithComments;
    }

    //Here i am combining the usersWithPosts with the PostsWithComments
    //This is an old version because now i am doing the modifications directly on the posts and dont need this function
    //I have reduced the iterations with 700 like that
    private combineUsersWithPostsWithComments=(usersWithPosts:UserWithPosts[])=>{
        const postss=this.forUsersWithPostsWithComments(this.posts);

        return usersWithPosts.map(userWithPosts=>{
            this.count++;
            return{
                userId:userWithPosts.userId,
                name:userWithPosts.name,
                username:userWithPosts.username,
                email:userWithPosts.email,
                posts:postss[userWithPosts.userId]!.postsWithComments||[],
            }
        })
    }

    public generateUserArray=async():Promise<void>=>{
        try {
            this.loggerFetching("Fetching users and posts and comments...");
            // this.users=await this.fetchUsers();
            // this.posts=await this.fetchPosts();
            // this.comments=await this.fetchComments();
            await this.fetchAll();
            
            this.loggerProcessing("Combining every users with their posts...");
            const postWithComments=this.combinePostsWithComments(this.posts);
            this.posts=postWithComments;  

            this.usersWithPosts=this.combineUsersWithPosts(this.users);

            this.loggerProcessing("Combine every posts with their comments...")

            this.usersWithPosts.forEach(finalUserWithPosts=>{
                console.log(finalUserWithPosts.userId,finalUserWithPosts.email,finalUserWithPosts.name,finalUserWithPosts.username);
                finalUserWithPosts.posts.forEach(post=>{
                    console.log(post);
                })
            })
            
            console.log(`The number of iterations is:${this.count}`);

            console.log("Success");
        } catch (error) {
            console.log(error);
        }
    }
}

const main=new ReportGenerator();
main.generateUserArray(); 