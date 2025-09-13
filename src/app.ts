
interface User{
    id:number,
    name:string,
    username:string,
    email:string
}

interface Post{
    id:number,
    userId:number,
    title:string,
    body:string

}

interface UserWithPosts{
    userId:number,
    name:string,
    email:string,
    username:string,
    posts:Post[]
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
                const postsForUser=this.posts.filter(post=>post.userId===user.id)
                
                return{ userId:user.id,
                        username:user.username,
                        email:user.email,
                        name:user.name,
                        posts:postsForUser }
            });

        } catch (error) {
            console.log("Error in combineUsersWithPosts");
            throw error;
        }
    }

    
    

    private postingFunction=(userWithPosts:UserWithPosts)=>{
        console.log(userWithPosts)
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