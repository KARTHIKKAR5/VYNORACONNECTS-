import Teams from "./pages/Teams";
import Projects from "./pages/Projects";
import "./App.css";

function App() {
    return (
        <div>
            <header>
                <h1>Vynora Campus Platform</h1>
            </header>

            <Teams />

            <Projects />
        </div>
    );
}

export default App;