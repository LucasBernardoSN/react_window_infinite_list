import { useEffect, useState, useRef } from "react";
import { VariableSizeList as List, VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

type RowHeight = {
  [index: number]: number;
};

type RowProps = {
  index: number;
  style: React.CSSProperties;
  setRowHeight: (index: number, size: number) => void;
  images: string[];
};

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

const Row = ({ index, style, setRowHeight, images }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      setRowHeight(index, rowRef.current.clientHeight);
    }
  }, [rowRef]);

  return (
    <div style={style}>
      <div
        ref={rowRef}
        style={{
          width: "500px",
          height: "500px",
        }}
      >
        <img src={images[index]} alt="avatar" />
      </div>
    </div>
  );
};

export const App = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  const images = Array.from(Array(1000).keys()).map((i) => {
    return `https://picsum.photos/id/${i}/720/640.webp`;
  });

  const listRef = useRef<VariableSizeList<any>>(null);
  const rowHeights = useRef<RowHeight>({});

  function getRowHeight(index: number) {
    return rowHeights.current[index] + 8 || 82;
  }

  function setRowHeight(index: number, size: number) {
    listRef?.current?.resetAfterIndex(0);

    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="App">
      <AutoSizer>
        {({ height }) => (
          <List
            className="List"
            height={height}
            itemCount={images.length}
            itemSize={getRowHeight}
            ref={listRef}
            width={windowSize.innerWidth}
          >
            {(props) => (
              <Row {...props} images={images} setRowHeight={setRowHeight} />
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};
