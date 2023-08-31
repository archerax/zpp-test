import { ReactNode, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

const preloadSize = 1000;

export interface Tile {
  left: number;
  top: number;
  width: number;
  height: number;
  key: string | number;
  content: ReactNode;
}

export interface VirtualCanvasProps {
    contentWidth: number;
    contentHeight: number;
    tiles: Tile[];
}

export function VirtualCanvas({ contentWidth, contentHeight, tiles }: VirtualCanvasProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollPaddingRef = useRef<HTMLDivElement>(null);
  const zoomPanPinchComponentRef = useRef<ReactZoomPanPinchRef>(null);

  const [visibleTiles, setVisibleTiles] = useState<Tile[]>([]);

  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    if (wrapper) {
      const observer = new ResizeObserver(() => {
        if (zoomPanPinchComponentRef.current) {
          zoomPanPinchComponentRef.current.zoomIn(0, 0, undefined); // zoom by 0% to force zpp to recalculate
        }
      });
      observer.observe(wrapper);
      return () => {
        observer.disconnect();
      };
    }
  }, [scrollWrapperRef,zoomPanPinchComponentRef]);
  
  const onScroll = (event: SyntheticEvent<HTMLDivElement>) => {
    if (zoomPanPinchComponentRef.current) {
      const scrollX = Math.round(event.currentTarget.scrollLeft);
      const scrollY = Math.round(event.currentTarget.scrollTop)
      const positionX = Math.round(-zoomPanPinchComponentRef.current.instance.transformState.positionX);
      const positionY = Math.round(-zoomPanPinchComponentRef.current.instance.transformState.positionY);

      if (positionX !== scrollX || positionY !== scrollY) {
        const newPositionX = positionX < 0 ? -positionX : -scrollX;
        zoomPanPinchComponentRef.current.setTransform(newPositionX, -scrollY, zoomPanPinchComponentRef.current.instance.transformState.scale, 0, undefined);
      }
    }
  };

  const onTransformed = useCallback((ref: ReactZoomPanPinchRef) => {
    const wrapper = ref.instance.wrapperComponent;
    const transformState = ref.instance.transformState;
    if (wrapper) {
      const scale = transformState.scale;
      const left = -transformState.positionX;
      const top = -transformState.positionY / scale;
      const width = wrapper.clientWidth / scale;
      const height = wrapper.clientHeight / scale;

      const updateVisibleTiles = tiles.filter(tile => tile.top + tile.height > top - preloadSize &&
                                              tile.top < top + height + preloadSize &&
                                              tile.left + tile.width > left - preloadSize &&
                                              tile.left < left + width + preloadSize);
      
      setVisibleTiles(visibleTiles => {
        if (updateVisibleTiles.length !== visibleTiles.length) {
          return updateVisibleTiles;
        }
        for (let i = 0; i < visibleTiles.length; i++) {
          if (updateVisibleTiles[i] !== visibleTiles[i]) {
            return updateVisibleTiles;
          }
        }
        return visibleTiles;
      });

      if (scrollWrapperRef.current && scrollPaddingRef.current) {
        scrollPaddingRef.current.style.width = `${contentWidth*scale}px`;
        scrollPaddingRef.current.style.height = `${contentHeight*scale}px`;
        scrollWrapperRef.current.scrollLeft = -transformState.positionX;
        scrollWrapperRef.current.scrollTop = -transformState.positionY;
      }
    }
  }, [contentWidth, contentHeight, tiles]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "scroll" }} onScroll={onScroll} ref={scrollWrapperRef}>
      <div style={{ position: "absolute", left: "0px", top: "0px" }} ref={scrollPaddingRef}></div>
      <TransformWrapper
        minScale={0.1}
        maxScale={2}
        disablePadding={true}
        onInit={onTransformed}
        onTransformed={onTransformed}
        customTransform={(x, y, s) => `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${s})`}
        ref={zoomPanPinchComponentRef}>
        <TransformComponent
          wrapperStyle={{ position: "sticky", left: "0px", top: "0px", width: "100%", height: "100%" }}
          contentStyle={{ width: `${contentWidth}px`, height: `${contentHeight}px` }}>
          {
            visibleTiles.map(tile => (
              <div key={tile.key} style={{ position: "absolute", left: `${tile.left}px`, top: `${tile.top}px`, width: `${tile.width}px`, height: `${tile.height}px` }}>
                {tile.content}
              </div>
            ))
          }
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
