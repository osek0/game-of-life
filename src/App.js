import React, { useCallback, useState, useRef } from 'react';
import produce from 'immer';

const numRows = 50;
const numCols = 50;
const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1]
];

const createZeroesGrid = () => {
  const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
}

const App = () => {

  const [grid, setGrid] = useState(() => createZeroesGrid());
  const [started, setStarted] = useState(false);

  const generateGrid = () => {
    return grid.map((rows, rowIndx) => {
      return rows.map((col, colIndx) => {
        return( 
        <div 
          key={`${rowIndx}${colIndx}`} 
          onClick={() => {
            const newGrid = produce(grid, draft => {
              draft[rowIndx][colIndx] = grid[rowIndx][colIndx] ? 0 : 1;
            })
            return setGrid(newGrid);
          }} 
          style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: col ? 'black' : undefined,
            border: 'solid 1px lightgrey'
        }}>
        </div>
        );
      });
    });
  };

  const startedRef = useRef(started);
  startedRef.current = started;

  const runSimulation = useCallback(() => {
    if(!startedRef.current) {
      return;
    }
    
    setGrid(grid => {
      return produce(grid, draft => {
        for(let i = 0; i < numRows; i++) {
          for(let j = 0; j < numCols; j++) {
            let neighbors = 0;

            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >=0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += grid[newI][newJ];
              }
            });

            if(neighbors < 2 || neighbors > 3) {
              draft[i][j] = 0;
            } else if(grid[i][j] === 0 && neighbors === 3) {
              draft[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <button 
        onClick={() => {
          setStarted(!started);
          if(!started) {
            startedRef.current = true;
            runSimulation();
          }
        }}
      >
        {started ? 'stop' : 'start'}
      </button>
      <div className="App" style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {generateGrid()}
      </div>
    </>
  );
}

export default App;
