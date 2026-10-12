
import { useState } from "react";
import Teams from "./pages/Teams";
import Projects from "./pages/Projects";
import "./App.css";

function App() {
  const [page, setPage] = useState("projects");

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#" onClick={() => setPage("projects")}>
          vynora<span>.</span>
        </a>

        <nav>
          <button
            className={page === "teams" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("teams")}
          >
            Teams
          </button>

          <button
            className={page === "projects" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("projects")}
          >
            Projects
          </button>
        </nav>
      </header>

      <main className="main-content">
        {page === "teams" ? <Teams /> : <Projects />}
      </main>

      <footer>Discover. Connect. Build. <strong>vynora.</strong></footer>
    </div>
  );
}

export default App;
