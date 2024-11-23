import React, { useEffect, useState } from "react";
import "./Feed.css";

import thumbnail1 from "../../assets/thumbnail1.png";

import { Link } from "react-router-dom";
import { API_KEY, value_convertor } from "../../data";
import moment from "moment";

const Feed = ({ category }) => {
  const [data, setData] = useState([]); // Move the useState to the top-level scope

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=150&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

    try {
      const response = await fetch(videoList_url);
      const result = await response.json();
      setData(result.items || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="feed">
      {data.map((item, index) => (
        <Link
          to={`video/${item.snippet.categoryId}/${item.id}`}
          className="card"
          key={index}
        >
          <img
            src={item.snippet.thumbnails.medium.url}
            alt={item.snippet.title}
          />
          <h2>{item.snippet.title}</h2>
          <h3>{item.snippet.channelTitle}</h3>
          <p>
            {value_convertor(item.statistics.viewCount)} Views &bull;{" "}
            {moment(item.snippet.publishedAt).fromNow()}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Feed;
