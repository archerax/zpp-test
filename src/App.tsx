import { Tile, VirtualCanvas } from './VirtualCanvas';

const numTilesX = 25;
const numTilesY = 1000;
const tileSizeX = 100;
const tileSizeY = 1000;

const tiles: Tile[]  = [];
for (let y = 0; y < numTilesY; y++) {
  for (let x = 0; x < numTilesX; x++) {
    const left = x * tileSizeX;
    const top = y * tileSizeY;
    const colour = `hsl(${y * 360 / 100 + x * 10}, 75%, 50%)`;
    tiles.push({
      left: left,
      top: top,
      width: tileSizeX,
      height: tileSizeY,
      key: `(${left},${top})`,
      content: <div style={{ width: "100%", height: "100%", backgroundColor: colour }}></div>
    });
  }
}

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <VirtualCanvas contentWidth={numTilesX*tileSizeX} contentHeight={numTilesY*tileSizeY} tiles={tiles} />
    </div>
  );
}

export default App;
