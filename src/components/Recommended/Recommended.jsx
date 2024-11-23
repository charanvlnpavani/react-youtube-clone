import React, { useEffect, useState } from "react";
import "./Recommended.css";

import { API_KEY, value_convertor } from "../../data";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const relatedVideoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
      const response = await fetch(relatedVideoUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApiData(data.items || []);
      setError(null);
    } catch (error) {
      setError(error.message);
      setApiData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const formatViewCount = (views) => {
    if (!views) return "N/A";
    return Intl.NumberFormat("en", { notation: "compact" }).format(views);
  };

  return (
    <div className="recommended">
      {loading && <p>Loading videos...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && apiData.length === 0 && <p>No videos found.</p>}
      {apiData.map((item) => {
        const { id, snippet, statistics } = item;
        const { title, channelTitle, thumbnails } = snippet;
        return (
          <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={id} className="side-video-list">
            <img src={thumbnails?.medium?.url} alt={title} />
            <div className="vid-info">
              <h4>{title}</h4>
              <p>{channelTitle}</p>
              <p>{value_convertor(statistics?.viewCount)} Views</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Recommended;
