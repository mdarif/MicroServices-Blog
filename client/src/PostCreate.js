import React, { useState } from 'react';
import axios from 'axios';

function PostCreate() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:4000/posts', {
        title,
      });
      setTitle('');
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type='text'
            className='form-control'
          />
        </div>
        {error && (
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>
        )}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
}

export default PostCreate;
