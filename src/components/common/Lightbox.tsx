import React from "react";
export default function Lightbox() { return (
    <dialog className="lb" id="lb" aria-label="Screenshot viewer">
      <button className="lb-x" type="button" aria-label="Close viewer">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18"></path>
        </svg>
      </button>
      <button className="lb-prev" type="button" aria-label="Previous screenshot">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M15 5l-7 7 7 7"></path>
        </svg>
      </button>
      <figure className="lb-fig">
        <img alt="" decoding="async" />
        <figcaption className="lb-cap"></figcaption>
      </figure>
      <button className="lb-next" type="button" aria-label="Next screenshot">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </dialog>
); }
