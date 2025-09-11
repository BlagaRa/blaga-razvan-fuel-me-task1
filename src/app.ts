
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
    user:User,
    posts:Post[]
}

class ReportGenerator{
    private users:User[]=[];
    private posts:Post[]=[];
    private usersWithPosts:UserWithPosts[]=[];
    

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
                
                return{ user:user , posts:postsForUser }
            });

        } catch (error) {
            console.log("Error in combineUsersWithPosts");
            throw error;
        }
    }

    private createLogger=async(context:string)=>{
        if(context==='DataFetching'){
            return 'Fetching users and posts...'
        }else if(context==='CombiningUserWPosts'){
            return 'Combining the users with its posts'
        }else if(context='Posting'){
            return 'Posting the users with their posts'
        }
        return 'This context does not exist';
    }

    

    public main=async():Promise<void>=>{
        try {
            console.log(this.createLogger('DataFetching'));
            await this.processingData();
            
            console.log(this.createLogger("CombiningUserWPosts"));
            this.combineUsersWithPosts();

            console.log(this.createLogger('Posting'))
            console.log(this.usersWithPosts);
        } catch (error) {
            console.log(error);
        }
    }
}

const main=new ReportGenerator();
main.main();