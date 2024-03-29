import React from "react";
import "./css/common.css";

const Genres = (props) => {
  const { genres, currentGenre, onGenreSelect } = props;
  return (
    <div className="col-md-12" style={{ opacity: 0.8 }}>
      <div className="container">
        <div className="list-group">
          {genres.map((genre) => {
            return (
              <a
                key={genre._id}
                onClick={() => onGenreSelect(genre)}
                className={
                  genre.name === currentGenre.name
                    ? "list-group-item active"
                    : "list-group-item"
                }
                style={{
                  fontWeight: 500,
                  textAlign: "center",
                  fontSize: 21,
                  cursor: "pointer",
                }}
              >
                {genre.name}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Genres;
