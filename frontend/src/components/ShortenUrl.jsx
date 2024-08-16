import React, { useState } from 'react';
import axios from 'axios';

const ShortenUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/urls/shorten', { originalUrl });
      setShortUrl(response.data.shortUrl);
    } catch (error) {
      alert('URL shortening failed');
    }
  };

  return (
    <div>
      <h1>Shorten URL</h1>
      <form onSubmit={handleSubmit}>
        <input type="url" placeholder="Original URL" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} required />
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && <p>Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>}
    </div>
  );
};

export default ShortenUrl;
