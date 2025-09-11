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

    

    private processingData=async()=>{
        try {
            this.users=await this.fetchData<User[]>("https://jsonplaceholder.typicode.com/users");
            this.posts=await this.fetchData<Post[]>("https://jsonplaceholder.typicode.com/posts");
        } catch (error) {
            console.log("Error in processingData");
            throw error;
        }
    }

    public main=async():Promise<void>=>{
        try {
            await this.processingData();
            console.log(this.users);
            console.log(this.posts);
        } catch (error) {
            console.log(error);
            
        }
    }
}

const main=new ReportGenerator();
main.main();