import React, { useState } from 'react';
import axios from 'axios';

function CommentCreate({ postId }) {
  const [content, setContent] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post(`http://localhost:4001/posts/${postId}/comments`, {
        content,
      })
      .catch((err) => {
        console.log(err.message);
      });

    setContent('');
  };

  return (
    <div className='container'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
}

export default CommentCreate;
