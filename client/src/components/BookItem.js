import React from "react";
import "../styles/Books.css"; // Make sure CSS file is imported

const BookItem = ({ image, title, author, genre }) => {
  return (
    <div className="book-card">
      <img
        src={image}
        alt={title}
        className="bookImage"
      />
      <h2 className="bookTitle">{title}</h2>
      <p className="bookAuthor">By: {author}</p>
      <p className="bookGenre">{genre}</p>
    </div>
  );
};

export default BookItem;
