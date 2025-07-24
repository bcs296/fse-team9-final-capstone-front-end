import { useState } from "react";

export function Articles(params) {
  const [showQuery, setShowQuery] = useState(false);
  let articles = params.data.articles ? params.data.articles : [];
  let queryName = params.query.queryName ? params.query.queryName : "na";
  let articleCount = params.data.totalResults ? params.data.totalResults : 0;
  let query = params.query.q;
  let language = params.query.language;

  return (
    <div>
      <div>
        <br />
        <button onClick={() => setShowQuery(!showQuery)}>
          {showQuery ? "Hide Query Details" : "Show Query Details"}
        </button>
        <br />
        {showQuery && (
          <div id="displayQuery">
            <ul>
              <li>Query Name: {queryName}</li>
              <li>Articles: {articleCount}</li>
              <li>Query text: {query}</li>
              <li>Language: {language}</li>
            </ul>
          </div>
        )}
      </div>
      <div id="articlesList">
        <ol>
          {articles.map((item, idx) => {
            if (item) {
              if (item.title) {
                if (item.title === "[Removed]") {
                  return <li key={idx}>Was Removed</li>;
                }
                let trimTitle = item.title.substring(0, 60);
                //return (<li key={idx}>{trimTitle}<a href={item.url} target="_blank" rel="noreferrer" >&nbsp;Link</a></li>);
                return (
                  <li className="articleItems" key={idx}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {trimTitle}
                    </a>
                  </li>
                );
              } else {
                return <li key={idx}>No Title</li>;
              }
            } else {
              return <li key={1}>No Item</li>;
            }
          })}
        </ol>
      </div>
    </div>
  );
}
