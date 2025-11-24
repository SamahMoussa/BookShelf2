import { createContext, useState, useContext } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (book) => {
    if (wishlist.some((b) => b.id === book.id)) return false;
    setWishlist((prev) => [...prev, book]);
    return true;
  };

  const removeFromWishlist = (bookId) => {
    setWishlist((prev) => prev.filter((b) => b.id !== bookId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
