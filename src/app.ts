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

const fetchData=async<T>(url:string):Promise<T>=>{
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

let users:User[]=[];
let posts:Post[]=[];

const fetchAllData=async()=>{
    try {
        
        users=await fetchData<User[]>("https://jsonplaceholder.typicode.com/users");
        posts=await fetchData<Post[]>("https://jsonplaceholder.typicode.com/posts");

    } catch (error) {
        console.log("Error in fetchAllData");
        console.error("Failed to fetch the request",error)
    }
}

const main=async()=>{
    await fetchAllData();
    console.log(users);
    console.log(posts);
}

main()







