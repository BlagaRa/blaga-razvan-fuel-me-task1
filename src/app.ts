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