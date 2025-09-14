interface User{
    id:number,
    name:string,
    username:string,
    email:string,
    address:{
        street:string,
        suite:string,
        city:string,
        zipcode:string,
        geo:{
            lat:string,
            lng:string
        }
    }
    phone:string,
    website:string,
    company:{
        name:string,
        catchPhrase:string,
        bs:string,
    }
}

interface Post{
    userId:number,
    id:number,
    title:string,
    body:string
}

interface UserWithPosts{
    userId:number,
    name:string,
    username:string,
    email:string,
    posts:{
            postId:number,
            title:string,
            body:string
    }[];  
}

function createLogger(context:string){
    function loggingFunction(message:string){
        console.log(`[${context}] ${message}`)
    }
    return loggingFunction;
}

class ReportGenerator{
    private users:User[]=[];
    private posts:Post[]=[];
    private usersWithPosts:UserWithPosts[]=[];
    
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

    

    private processingData=async():Promise<void>=>{
        try {
            this.users=await this.fetchData<User[]>("https://jsonplaceholder.typicode.com/users");
            this.posts=await this.fetchData<Post[]>("https://jsonplaceholder.typicode.com/posts");
        } catch (error) {
            console.log("Error in processingData");
            throw error;
        }
    }

    private combineUsersWithPosts=async()=>{
        try {
            this.usersWithPosts=this.users.map(user=>{
                const existingPosts:Post[]=this.posts.filter(post=>post.userId===user.id);

                const posts:{postId:number,title:string,body:string}[]=existingPosts.map(post=>{
                    return {postId:post.id,
                            title:post.title,
                            body:post.body
                    }
                })
                
                return {userId:user.id,
                        email:user.email,
                        username:user.username,
                        name:user.name,
                        posts
                }
            })

        } catch (error) {
            console.log("Error in combineUsersWithPosts");
            throw error;
        }
    }

    
    

    private postingFunction=(userWithPosts:UserWithPosts)=>{
        console.log(userWithPosts);
    }



    public main=async():Promise<void>=>{
        try {
            this.loggerFetching("Fetching users and posts...");
            await this.processingData();
            
            this.loggerProcessing("Combining every users with their posts...");
            await this.combineUsersWithPosts();

            this.loggerProcessing("Printing users with their posts");
            this.usersWithPosts.forEach(user=>this.postingFunction(user))

            console.log("Success");
        } catch (error) {
            console.log(error);
        }
    }
}

const main=new ReportGenerator();
main.main();