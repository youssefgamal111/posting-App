export interface Post {
  id?: string;
  title?: string;
  content?: string;
  imagepath?:string|File
  creator:string;
}
