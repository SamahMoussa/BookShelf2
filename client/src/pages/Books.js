import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import BookItem from "../components/BookItem";
import { SearchContext } from "../context/SearchContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import "../styles/Books.css";

const Books = () => {
  const { searchText } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  // Reviews state
  const [bookReviews, setBookReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // ---------------- FETCH BOOKS ----------------
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // ---------------- FETCH REVIEWS ----------------
  useEffect(() => {
    if (!selectedBook) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/reviews/${selectedBook.id}`
        );

        setBookReviews(
          res.data.map((r) => ({
            id: r.id,
            userId: r.user_id,
            user: r.username,
            text: r.review_text,
            rating: r.rating,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [selectedBook]);

  // ---------------- FILTER BOOKS ----------------
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchText.toLowerCase()) ||
      book.author.toLowerCase().includes(searchText.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchText.toLowerCase())
  );

  // ---------------- STARS ----------------
  const renderStars = (value, interactive = false) =>
    [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          style={{
            cursor: interactive ? "pointer" : "default",
            color:
              starValue <= (interactive ? hoverRating || rating : value)
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

  // ---------------- WISHLIST ----------------
  const handleAddToWishlist = async () => {
    if (!user) return alert("Please log in");

    const exists = wishlist.find((b) => b.id === selectedBook.id);

    try {
      if (exists) {
        await axios.delete("http://localhost:5000/api/wishlist", {
          data: { user_id: user.id, book_id: selectedBook.id },
        });
        removeFromWishlist(selectedBook.id);
        alert("Removed from wishlist");
      } else {
        await axios.post("http://localhost:5000/api/wishlist", {
          user_id: user.id,
          book_id: selectedBook.id,
        });
        addToWishlist(selectedBook);
        alert("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      alert("Wishlist action failed");
    }
  };

  // ---------------- SUBMIT REVIEW ----------------
  const handleReviewSubmit = async () => {
    if (!user) return alert("Please log in");
    if (!reviewText && rating === 0)
      return alert("Please provide a review or rating");

    try {
      const res = await axios.post("http://localhost:5000/reviews", {
        user_id: user.id,
        book_id: selectedBook.id,
        rating,
        review_text: reviewText,
      });

      // Update UI immediately
      setBookReviews((prev) => [
        {
          id: res.data.insertId,
          userId: user.id,
          user: user.username,
          text: reviewText,
          rating,
        },
        ...prev,
      ]);

      setReviewText("");
      setRating(0);
      alert("Review submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  // ---------------- DELETE REVIEW ----------------
  const handleDeleteReview = async (reviewId, reviewUserId) => {
    if (!user || user.id !== reviewUserId) return;

    try {
      await axios.delete("http://localhost:5000/reviews", {
        data: { review_id: reviewId },
      });
      setBookReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  // ---------------- LOADING / ERROR ----------------
  if (loading) return <p className="loading-text">Loading books...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // ---------------- BOOK DETAILS ----------------
  if (selectedBook) {
    return (
      <div className="bookDetail">
        <button onClick={() => setSelectedBook(null)}>Back to list</button>

        <h1>{selectedBook.title}</h1>
        <h3>by {selectedBook.author}</h3>

        <img
          src={`http://localhost:5000/images/${selectedBook.image}`}
          alt={selectedBook.title}
        />

        <p>
          <strong>Genre:</strong> {selectedBook.genre}
        </p>

        <p>{selectedBook.description}</p>

        <button onClick={handleAddToWishlist}>
          {wishlist.find((b) => b.id === selectedBook.id)
            ? "Remove from Wishlist"
            : "Add to Wishlist"}
        </button>

        <hr />

        <h2>Reviews</h2>
        {bookReviews.length === 0 && <p>No reviews yet.</p>}

        {bookReviews.map((rev) => (
          <div key={rev.id}>
            <strong>{rev.user}</strong>
            {rev.rating > 0 && <> — {renderStars(rev.rating)}</>}
            {rev.text && <p>{rev.text}</p>}
            {user && user.id === rev.userId && (
              <button
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDeleteReview(rev.id, rev.userId)}
              >
                Delete
              </button>
            )}
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

            <div style={{ margin: "10px 0" }}>{renderStars(rating, true)}</div>

            <button onClick={handleReviewSubmit}>Submit</button>
          </div>
        ) : (
          <p>Please log in to leave a review.</p>
        )}
      </div>
    );
  }

  // ---------------- BOOK LIST ----------------
  return (
    <div className="menu">
      <h1 className="menuTitle">Books</h1>

      <div className="menuList">
        {filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              style={{ cursor: "pointer" }}
            >
              <BookItem
                title={book.title}
                author={book.author}
                image={`http://localhost:5000/images/${book.image}`}
                genre={book.genre}
                description={book.description}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Books;
