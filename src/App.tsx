import { Tile, VirtualCanvas } from './VirtualCanvas';

const numStrips = 25;
const stripWidth = 2500;
const stripHeight = 1000;

const tiles: Tile[]  = [];
for (let i = 0; i < numStrips; i++) {
  tiles.push({
    x: 0,
    y: i * stripHeight,
    w: stripWidth,
    h: stripHeight,
    key: i * stripHeight,
    content: <div style={{ width: "100%", height: "100%", backgroundColor: `hsl(${i * 360 / numStrips}, 75%, 50%)` }}></div>
  });
}

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <VirtualCanvas w={2500} h={numStrips*stripHeight} tiles={tiles} />
    </div>
  );
}

export default App;
