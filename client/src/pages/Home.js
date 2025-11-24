import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { booksList } from "../data/booksList";
import "../styles/Home.css";

const Home = () => {
  const featuredBooks = booksList.filter(
    (book) => Number(book.id) >= 17 && Number(book.id) <= 22
  );

  const [currentIndex, setCurrentIndex] = useState(0);//carousel state

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === featuredBooks.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredBooks.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="home">

      <section className="hero">
        <h1>Welcome to BookShelf</h1>
        <p>Discover Your Next Favorite Book</p>
        <p>Dive into thousands of reviews from passionate readers.</p>
        <Link to="/books" className="hero-link">
          <button className="hero-btn">Start Exploring</button>
        </Link>      
      </section>

      <section className="featured-authors-section">
        <div className="featured">
          <h2 className="section-title">Featured Books</h2>

          <div className="slider">
            <button className="slide-btn left" onClick={prevSlide}>‹</button>

            <img
              src={featuredBooks[currentIndex].image}
              alt="book"
              className="slider-image"
            />

            <button className="slide-btn right" onClick={nextSlide}>›</button>
          </div>

          <h3 className="book-title">{featuredBooks[currentIndex].title}</h3>
          <p className="book-author">{featuredBooks[currentIndex].author}</p>
        </div>

        <div className="authors">
          <h2 className="section-title">Popular Authors</h2>

          <div className="authors-grid">
            <div className="author-card">Colleen Hoover</div>
            <div className="author-card">Ghassan Kanafani</div>
            <div className="author-card">Stephen King</div>
            <div className="author-card">Taylor Jenkins Reid</div>
            <div className="author-card">George R.R. Martin</div>
          </div>
        </div>

      </section>


      <section className="newsletter">
        <h2>Join Our Book Lovers Community</h2>
        <p>Stay updated with new releases, trends, and book recommendations.</p>
      </section>

    </div>
  );
};

export default Home;
