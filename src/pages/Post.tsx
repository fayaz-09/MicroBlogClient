import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar} from '@fortawesome/free-solid-svg-icons'

/*Declaring a type alias which is used when creating an array of comments map() can be used on*/
type Comment = {
    idcomments: number;
    username: string;
    comment: string;
    date: string;
}

/*Declaring a type alias which is used when creating an object of type Post to store the post when retrieved from the database.*/
type Post = {
    idposts: number;
    username: string;
    content: string;
    likes: number;
    comments: number;
    date: string;
}

function Post()
{
    const navigate = useNavigate();
    const location = useLocation();
    const postId = location.pathname.split("/")[2];
    const {currentUser} = useContext(AuthContext);
    
    
    /*Using api get call to get the individual post that will be displayed on this page*/
    const [post, setPost] = useState<Post>();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get(`/posts/${postId}`);
            setPost(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
    }, [postId]);

    /*On click function for allowing a user to delete their own post*/
    const handleDelete = async ()=>{
        try {
          await axios.delete(`/posts/${postId}`);
          navigate("/")
        } catch (err) {
          console.log(err);
        }
    }

    /*Gets user entered data from the form and then calls the api post method to crete a new comment in the mySQL database
    This function also uses an api update call to increase the value of total comments by 1*/
    const [content, setContent] = useState("");
    const handleSubmit = async(event: React.FormEvent , count: number) => {
        event.preventDefault();
        try {
            await axios.post(`/comments/`, {
                comment: content, 
                date: new Date(),
                postid: postId,
            })
            await axios.put(`/posts/${postId}`, {
                data : 'comments',
                number: count
            })
        } catch (err) {
            console.log(err)
        }
    }

    /*Uses api get method to gather data from mySQL database and then pass it to an array of type Comment for mapping*/
    const [comments, setComments] = useState<Comment[]>([]);
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await axios.get(`/comments/${postId}`);
                setComments(res.data);
            }catch(err){
                console.log(err);
            }
        };
        fetchData();
    }, []);

    /*On click function for allowing a user to delete their own comment*/
    const handleDeleteComment = async (Id:number)=>{
        try {
          await axios.delete(`/comments/${Id}`);
          navigate("/")
        } catch (err) {
          console.log(err);
        }
    }

    /*Function which handles the process of liking an individual post. First a get request is used to check if the user has already liked
    the post. If they have a delete request removes their like from the database, then the value for how many likes a post has is decreased by one.
    If no like is found the like is added and the like amount is increased by 1.*/
    const handleLike = async (usernum: number ,postnum : number, value: number)=>{
        try {
            const res = await axios.get(`/likes/${usernum}/${postnum}`);
            if(res.data != "")
            {
                try {
                    await axios.delete(`/likes/${postnum}`);
                    await axios.put(`/posts/${postnum}`, {
                        data : 'likes',
                        number: value-1
                    })
                  } catch (err) {
                    console.log(err);
                  }
            }
            else
            {
                try {
                    await axios.post(`/likes/${postnum}`);
                    await axios.put(`/posts/${postnum}`, {
                        data : 'likes',
                        number: value+1
                    })
                  } catch (err) {
                    console.log(err);
                  }
            }
        } catch (err) {
          console.log(err);
        }
    }

    return(
        <div className="PostPage">
            <div className="singlePost">
                <div className="content">
                    <h3>{post?.username}</h3>
                    <p className="text-box">{post?.content}</p>
                </div>
                <div className="details">
                    <div className="likes">
                        {post != null && <div>
                            { currentUser != null && <FontAwesomeIcon onClick={() => handleLike(currentUser.id ,post.idposts, post.likes)} icon={faStar} color="#e6e6e6" fontSize="2rem"/> }
                        </div>}    
                        <p>Likes: {post?.likes}</p>
                    </div>
                    <div className="date">
                        <p>Posted:</p>
                            <p>{post?.date.substring(0, 10)}</p>
                            <p>{post?.date.substring(11, 19)}</p>
                    </div>
                    <div className="delete">
                        {currentUser != null && <div>
                        {currentUser.username === post?.username && (
                            <button onClick={handleDelete}>Delete</button>
                        )}
                        </div>}
                    </div>
                    
                </div>
            </div>
            <div className="comments">
                <div className="existing">
                    <h3>Comments: </h3>
                    {comments.map(comment=>(
                        <div className="comment" key={comment.idcomments}>
                            <h3>{comment.username}</h3>
                            <p> {comment.comment}</p>
                            <p> date posted:  {comment.date.substring(0, 10)} {comment.date.substring(11, 19)}</p>
                            {currentUser != null && <div>
                            {currentUser.username === comment?.username && (
                            <button onClick={() => handleDeleteComment(comment.idcomments)} >Delete</button>
                            )}
                            </div>}
                        </div>
                    ))}
                </div>
                {currentUser != null && <div className="addComment">
                    <h3>Add comment</h3>
                    {post != null && <form onSubmit={(event) => handleSubmit(event, post.comments +1)}>
                        <textarea
                            value={content}
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                            placeholder="new comment"
                            rows={10}
                            required>
                        </textarea>
                        <button type="submit">Send comment</button>
                    </form>}
                </div>}
                
            </div>
            
        </div>
    );
}

export default Post;