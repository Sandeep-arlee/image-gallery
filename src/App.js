import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";

const ACCESS_KEY = "EjEKVCJTAFrqrhNF9VdcaR1PcnKuCeY4WwiXb0paXp4";

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    fetchImages(query, page);
  }, [page]); 

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchImages = async (searchQuery, pageNumber) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&page=${pageNumber}&client_id=${ACCESS_KEY}`
      );
      setImages((prevImages) => [...prevImages, ...response.data.results]); 
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setImages([]);
    setPage(1); 
    fetchImages(query, 1);
  };

  const lastImageRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect(); 
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); 
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Image Gallery</h1>
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️" : "🌙"}
      </button>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="gallery">
        {images.map((image, index) => {
          if (index === images.length - 1) {
            return (
              <div key={image.id} className="card" ref={lastImageRef}>
                <img src={image.urls.small} alt={image.alt_description} />
                <p>{image.alt_description || "No description"}</p>
              </div>
            );
          } else {
            return (
              <div key={image.id} className="card">
                <img src={image.urls.small} alt={image.alt_description} />
                <p>{image.alt_description || "No description"}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default App;
