import { QueryForm } from "./QueryForm";
import { Articles } from "./Articles";
import { useState, useEffect } from "react";
import { exampleQuery, exampleData, defaultQueries } from "./data";
import { SavedQueries } from "./SavedQueries";
import { LoginForm } from "./LoginForm";

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData); // current data returned from newsapi
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const urlNews = "/news";
  const urlQueries = "/queries";
  const urlUsersAuth = "/users/authenticate";
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);

  useEffect(() => {
    getNews(query);
  }, [query]);

  useEffect(() => {
    getQueryList();
  }, []);

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ");
        setSavedQueries(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  async function login() {
    if (currentUser !== null) {
      // logout
      setCurrentUser(null);
    } else {
      // login
      try {
        const response = await fetch(urlUsersAuth, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        if (response.status === 200) {
          setCurrentUser({ ...credentials });
          setCredentials({ user: "", password: "" });
        } else {
          alert(
            "Error during authentication! " +
              credentials.user +
              "/" +
              credentials.password
          );
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        setCurrentUser(null);
      }
    }
  }

  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("savedQueries array has been persisted:");
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  async function onResetQueries() {
    try {
      const emptyQueries = [];
      const response = await fetch(urlQueries, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emptyQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSavedQueries(emptyQueries);
      console.log("All saved queries have been cleared");
    } catch (error) {
      console.error("Error clearing saved queries:", error);
    }
  }

  function currentUserMatches(user) {
    if (currentUser) {
      if (currentUser.user) {
        if (currentUser.user === user) {
          return true;
        }
      }
    }
    return false;
  }

  function onFormSubmit(queryObject) {
    if (currentUser === null) {
      alert("Log in if you want to create new queries!");
      return;
    }
    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      alert(
        "guest users cannot submit new queries once saved query count is 3 or greater!"
      );
      return;
    }

    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    console.log(JSON.stringify(newSavedQueries));
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);
    setQuery(queryObject);
  }

  async function getNews(queryObject) {
    if (queryObject.q) {
      try {
        const response = await fetch(urlNews, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryObject),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    } else {
      setData({});
    }
  }

  return (
    <div>
      <div className="loginBlock">
        <LoginForm
          login={login}
          credentials={credentials}
          currentUser={currentUser}
          setCredentials={setCredentials}
        />
      </div>
      <div>
        <section className="parent">
          <div className="box">
            <span className="title">Query Form</span>
            {currentUser && (
              <>
                <QueryForm
                  currentUser={currentUser}
                  setFormObject={setQueryFormObject}
                  formObject={queryFormObject}
                  submitToParent={onFormSubmit}
                />
              </>
            )}
          </div>
          <div className="box">
            <span className="title">Saved Queries</span>
            <SavedQueries 
              savedQueries={currentUser ? savedQueries : defaultQueries}
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
              onReset={currentUser ? onResetQueries : null}
              currentUser={currentUser}
            />
          </div>
          <div className="box">
            <span className="title">Articles List</span>
            <Articles query={query} data={data} onRefresh={getNews} />
          </div>
        </section>
      </div>
    </div>
  );
}
