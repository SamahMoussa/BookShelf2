import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { booksList } from "../data/booksList";
import "../styles/Profile.css";
import { useWishlist } from "../context/WishlistContext";
import { useReviews } from "../context/ReviewContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useWishlist();
  const { reviews } = useReviews();

  if (!user) return <p>Please login to see your profile.</p>;

  // Get all reviews by this user
  const userReviews = booksList.flatMap((book) => {
    const bookReviews = reviews[book.id] || [];
    return bookReviews
      .filter((r) => r.user === user.username)
      .map((r) => ({
        bookId: book.id,
        bookTitle: book.title,
        rating: r.rating,
        text: r.text,
      }));
  });

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p>
        <strong>{user.username}</strong> — {user.email}
      </p>

      <section>
        <h3>Your Reviews</h3>
        {userReviews.length === 0 && <p>You have not reviewed any books yet.</p>}
        <ul>
          {userReviews.map((r, i) => (
            <li key={i}>
              <strong>{r.bookTitle}</strong> — {r.rating > 0 && `${r.rating} ★`} {r.text}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Your Wishlist</h3>
        {wishlist.length === 0 && <p>Your wishlist is empty.</p>}
        <div className="wishlist-grid">
          {wishlist.map((b) => (
            <div key={b.id} className="wishlist-item">
              <img src={b.image} alt={b.title} />
              <h4>{b.title}</h4>
              <p>{b.author}</p>
              <button onClick={() => removeFromWishlist(b.id)}>Remove</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
