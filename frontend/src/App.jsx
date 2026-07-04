import "./App.css";

import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <ChatBox />
    </div>
  );
}

export default App;