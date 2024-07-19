import React, { useState } from "react";
import { Link } from "react-router-dom";

function Create()
{
    const [content, setContent] = useState("");

    return(
        <div className="PostPage">
            <h1>New Post</h1>
            <input
                >
            </input>
        </div>
    );
}

export default Create;