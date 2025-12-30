import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/books");
        const data = await res.json();
        const featured = data.filter((book) => Number(book.id) >= 17 && Number(book.id) <= 22);
        setBooks(featured);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };

    fetchBooks();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === books.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? books.length - 1 : prev - 1));
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (books.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [books]);

  if (books.length === 0) return <div>Loading...</div>;

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
              src={`http://localhost:5000/images/${books[currentIndex].image}`}
              alt={books[currentIndex].title}
              className="slider-image"
            />
            <button className="slide-btn right" onClick={nextSlide}>›</button>
          </div>
          <h3 className="book-title">{books[currentIndex].title}</h3>
          <p className="book-author">{books[currentIndex].author}</p>
        </div>

        <div className="authors">
          <h2 className="section-title">Popular Authors</h2>
          <div className="authors-grid">
            {["Colleen Hoover", "Ghassan Kanafani", "Stephen King", "Taylor Jenkins Reid", "George R.R. Martin"].map((author) => (
              <div key={author} className="author-card">{author}</div>
            ))}
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
