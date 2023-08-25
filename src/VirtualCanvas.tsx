import { ReactNode, useCallback, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

const preloadSize = 250;

export interface Tile {
  x: number;
  y: number;
  w: number;
  h: number;
  key: string | number;
  content: ReactNode;
}

export interface VirtualCanvasProps {
    w: number;
    h: number;
    tiles: Tile[];
}

export function VirtualCanvas({ w, h, tiles }: VirtualCanvasProps) {
  const [visibleTiles, setVisibleTiles] = useState<Tile[]>([]);

  const onTransformed = useCallback((ref: ReactZoomPanPinchRef) => {
    const wrapper = ref.instance.wrapperComponent;
    const transformState = ref.instance.transformState;
    if (wrapper) {
      const z = transformState.scale;
      const x = -transformState.positionX;
      const y = -transformState.positionY / z;
      const w = wrapper.clientWidth / z;
      const h = wrapper.clientHeight / z;
      
      console.log(`position: (${x.toFixed(0)}, ${y.toFixed(0)})`);
      console.log(`size: (${w?.toFixed(0)}, ${h?.toFixed(0)})`);
      console.log(`zoom: ${(z*100).toFixed(0)}%`);

      console.log(`bounds: (${x.toFixed(0)}, ${y.toFixed(0)}) - (${(x+w).toFixed(0)}, ${(y+h).toFixed(0)})`);

      const updateVisibleTiles = tiles.filter(s => s.y + s.h > y - preloadSize && s.y < y + h + preloadSize);
      setVisibleTiles(updateVisibleTiles);
    }
  }, [tiles]);

  console.log("Render strips: %o", visibleTiles);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <TransformWrapper
        minScale={0.1}
        maxScale={2}
        disablePadding={true}
        onInit={onTransformed}
        onTransformed={onTransformed}>
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          {
            visibleTiles.map(tile => (
              <div key={tile.key} style={{ position: "absolute", left: `${tile.x}`, top: `${tile.y}px`, width: `${tile.w}px`, height: `${tile.h}px` }}>
                {tile.content}
              </div>
            ))
          }
          <div style={{ width: `${w}px`, height: `${h}px` }}></div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
