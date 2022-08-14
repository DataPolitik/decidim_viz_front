export interface UserResponse{
  categories: Array<User>
}

export interface User{
  id: number,
  name: string,
  comments: number
}
