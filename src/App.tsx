import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const numStrips = 25;
const stripWidth = 2500;
const stripHeight = 1000;

const strips: { y: number; colour: string }[]  = [];
for (let i = 0; i < numStrips; i++) {
  strips.push({ y: i * stripHeight, colour: `hsl(${i * 360 / numStrips}, 75%, 50%)` });
}

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <TransformWrapper minScale={0.1} maxScale={2}>
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          {
            strips.map(s => (
              <div style={{ position: "absolute", top: `${s.y}px`, height: `${stripHeight}px`, width: `${stripWidth}px`, backgroundColor: s.colour }}></div>
            ))
          }
          <div style={{ width: `${stripWidth}px`, height: `${numStrips*stripHeight}px` }}></div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default App;
