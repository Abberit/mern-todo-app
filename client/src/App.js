import { Button, version } from "antd";
import "./App.css";
import "antd/dist/antd.css";

function App() {
  return (
    <div className="App">
      <h1>antd version: {version}</h1>

      <Button type="primary" style={{ marginLeft: 8 }}>
        Primary Button
      </Button>
    </div>
  );
}

export default App;
