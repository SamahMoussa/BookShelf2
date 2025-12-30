import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      const res = await fetch(`http://localhost:5000/wishlist/${user.id}`);
      const data = await res.json();
      setWishlist(data);
    };

    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (bookId) => {
    await fetch("http://localhost:5000/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        book_id: bookId,
      }),
    });
    setWishlist((prev) => prev.filter((b) => b.id !== bookId));
  };

  if (!user) return <p>Please login.</p>;

  return (
    <div className="profile-page">
      <h2>{user.username}</h2>
      <p>{user.email}</p>

      <h3>Your Wishlist</h3>
      {wishlist.length === 0 && <p>Your wishlist is empty.</p>}

      <div className="wishlist-grid">
        {wishlist.map((b) => (
          <div key={b.id} className="wishlist-item">
            <img
              src={`http://localhost:5000/images/${b.image}`}
              alt={b.title}
            />
            <h4>{b.title}</h4>
            <p>{b.author}</p>
            <button onClick={() => removeFromWishlist(b.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
