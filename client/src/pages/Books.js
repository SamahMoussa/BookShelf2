import React, { useContext, useState } from "react";
import { booksList } from "../data/booksList";
import BookItem from "../components/BookItem";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useReviews } from "../context/ReviewContext";
import "../styles/Books.css";

const Books = () => {

  const { searchText } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const { wishlist, addToWishlist } = useWishlist();
  const { reviews, addReview } = useReviews();
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const filteredBooks = booksList.filter(
    (book) =>
      book.title.toLowerCase().includes(searchText.toLowerCase()) ||
      book.author.toLowerCase().includes(searchText.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleReviewSubmit = () => {
    if (!user) return alert("Please log in to submit a review");
    if (!reviewText && rating === 0)
      return alert("Please provide a review or a rating before submitting");

    addReview(selectedBook.id, { user: user.username, text: reviewText, rating });
    setReviewText("");
    setRating(0);
    alert("Review submitted!");
  };

  const handleAddToWishlist = () => {
    if (!user) return alert("Please log in to add to wishlist");
    const success = addToWishlist(selectedBook);
    if (success) alert("Book added to wishlist!");
    else alert("Book already in wishlist");
  };

  const renderStars = (value, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          style={{
            cursor: interactive ? "pointer" : "default",
            color:
              starValue <= (interactive ? (hoverRating || rating) : value)
                ? "#ffc107"
                : "#e4e5e9",
            fontSize: "24px",
          }}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          ★
        </span>
      );
    });
  };

  if (selectedBook) {
    const bookReviews = reviews[selectedBook.id] || [];

    return (
      <div className="bookDetail">
        <button onClick={() => setSelectedBook(null)}>Back to list</button>
        <h1>{selectedBook.title}</h1>
        <h3>by {selectedBook.author}</h3>
        <img src={selectedBook.image} alt={selectedBook.title} />
        <p><strong>Genre:</strong> {selectedBook.genre}</p>
        <p>{selectedBook.description}</p>

        <button onClick={handleAddToWishlist} style={{ margin: "10px 0" }}>
          Add to Wishlist
        </button>

        <hr />

        <h2>Reviews</h2>
        {bookReviews.length === 0 && <p>No reviews yet.</p>}
        {bookReviews.map((rev, idx) => (
          <div key={idx} >
            <strong>{rev.user}</strong> {rev.rating > 0 && <>- {renderStars(rev.rating)}</>}
            {rev.text && <p>{rev.text}</p>}
          </div>
        ))}

        {user ? (
          <div className="reviewForm">
            <h3>Leave a Review or Rating</h3>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review (optional)..."
            />
            <div style={{ margin: "10px 0" }}>
              {renderStars(rating, true)}
              <p style={{ fontSize: "12px", color: "#555" }}>Click stars to rate (optional)</p>
            </div>
            <button onClick={handleReviewSubmit}>Submit</button>
          </div>
        ) : (
          <p>Please log in to leave a review or rating.</p>
        )}
      </div>
    );
  }

  return (
    <div className="menu">
      <h1 className="menuTitle">Books</h1>
      <div className="menuList">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            style={{ cursor: "pointer" }}
          >
            <BookItem
              title={book.title}
              author={book.author}
              image={book.image}
              genre={book.genre}
              description={book.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
