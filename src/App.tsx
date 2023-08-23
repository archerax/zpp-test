import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <TransformWrapper minScale={0.1} maxScale={2}>
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div style={{ height: "1000px", width: "1000px", backgroundColor: "red" }}></div>
          <div style={{ height: "1000px", width: "1000px", backgroundColor: "orange" }}></div>
          <div style={{ height: "1000px", width: "1000px", backgroundColor: "yellow" }}></div>
          <div style={{ height: "1000px", width: "1000px", backgroundColor: "green" }}></div>
          <div style={{ height: "1000px", width: "1000px", backgroundColor: "blue" }}></div>
          <div style={{ height: "1000px", width: "1000px", backgroundColor: "indigo" }}></div>
          <div style={{ height: "1000px", width: "1000px", backgroundColor: "violet" }}></div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default App;
