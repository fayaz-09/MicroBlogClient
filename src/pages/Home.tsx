import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faStar, faUser } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from "../context/authContext";

/*Declaring a type alias which is used when creating an array of posts map() can be used on.*/
type Post = {
    idposts: number;
    username: string;
    content: string;
    likes: number;
    comments: number;
    date: string;
}


function Home()
{
    //React function which allows for moving between different pages
    const navigate = useNavigate();

    /*Gets user entered data from the form and then calls the api post method to crete new post*/
    const [content, setContent] = useState("");
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        try {
            await axios.post(`/posts/`, {
                content: content, 
                comments: 0,
                likes: 0,
                date: new Date(),
            })
            navigate("/")
        } catch (err) {
            console.log(err)
        }
    }

    /*Uses api get method to gather data from mySQL database and then pass it to an array of type Post for mapping*/
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await axios.get(`/posts`);
                setPosts(res.data);
            }catch(err){
                console.log(err);
            }
        };
        fetchData();
    }, []);

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

    /*used for checking to see if a user is signed in*/
    const {currentUser} = useContext(AuthContext);
    
    return(
        <div className="Main">
                {currentUser != null && <div className="Profile">
                    <h1>{currentUser.username}</h1>

                    <h3>Send new post: </h3>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <textarea
                            value={content}
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                            placeholder="new post"
                            rows={10}
                            required>
                        </textarea>
                        <button type="submit">Send post</button>
                    </form>
                </div>}
            <div className="PostsMain">
                <h1>Global Posts</h1>
                {posts.map((post)=>(
                    <div className="post" key={post.idposts}>
                        <div className="content">
                            <Link className="link" to={`/post/${post.idposts}`}>
                                <h3>{post.username}</h3>
                                <p>{post.content.substring(0, 40)}</p>
                            </Link>
                        </div>
                        <div className="details">
                            <div className="likes">
                                {currentUser != null &&<FontAwesomeIcon onClick={() => handleLike(currentUser.id ,post.idposts, post.likes)} icon={faStar} color="#e6e6e6" fontSize="2rem"/>}
                                <p>Likes: {post.likes}</p>
                            </div>
                            <div className="comments">
                                <FontAwesomeIcon icon={faComment} color="#e6e6e6" fontSize="2rem"/>
                                <p>: {post.comments}</p>
                            </div>
                            <div className="date">
                                <p>Posted:</p>
                                <p>{post.date.substring(0, 10)}</p>
                                <p>{post.date.substring(11, 19)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;