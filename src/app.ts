interface User{
    id:number,
    name:string,
    username:string,
    email:string
}

 interface Post{
    id:number,
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




