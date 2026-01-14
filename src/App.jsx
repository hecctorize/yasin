import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";
import "./App.css";


function App() {
    return (
        <div className="App">
            <main className="main-content">
                <div className="merkez">
                    <Header />
                    <Content />
                </div>
            </main>

            <Footer />
        </div>

    );
}

export default App;
