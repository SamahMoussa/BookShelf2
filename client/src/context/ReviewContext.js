import { createContext, useState, useContext } from "react";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState({}); // { bookId: [{ user, text, rating }] }

  const addReview = (bookId, review) => {
    setReviews((prev) => {
      const bookReviews = prev[bookId] || [];
      return { ...prev, [bookId]: [...bookReviews, review] };
    });
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewContext);
