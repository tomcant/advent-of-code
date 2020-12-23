const { readGroupedLines } = require('../../utils/file-io');

const arrangeTiles = tiles => {
  let arranged = [];

  const tileIds = Object.keys(tiles);
  const width = Math.sqrt(tileIds.length);

  const fits = tile => {
    let matchesLeft = true;
    let matchesAbove = true;

    if (arranged.length % width > 0) {
      const left = arranged[arranged.length - 1].grid.map(row => row[row.length - 1]);
      matchesLeft = left.join('') === tile.grid.map(row => row[0]).join('');
    }

    if (arranged.length >= width) {
      const above = arranged[arranged.length - width].grid;
      matchesAbove = above[above.length - 1] === tile.grid[0];
    }

    return matchesLeft && matchesAbove;
  };

  return (function arrange() {
    if (arranged.length === tileIds.length) {
      return arranged;
    }

    const toArrange = tileIds.filter(id => !arranged.some(
      ({ id: arrangedId }) => id === arrangedId
    ));

    for (const id of toArrange) {
      let grid = tiles[id];

      for (let rotation = 0; rotation < 4; ++rotation) {
        const orientations = [grid, flipHorizontal(grid)];

        for (const grid of orientations) {
          const tile = { id, grid };

          if (fits(tile)) {
            arranged.push(tile);
            const arrangement = arrange(tile);

            if (arrangement) {
              return arrangement;
            }

            arranged.pop();
          }
        }

        grid = rotateClockwise(grid);
      }
    }
  })();
};

const rotateClockwise = grid => {
  const newGrid = [];

  for (let col = 0; col < grid[0].length; ++col) {
    let newRow = '';

    for (let row = grid.length - 1; row >= 0; --row) {
      newRow += grid[row][col];
    }

    newGrid.push(newRow);
  }

  return newGrid;
};

const flipHorizontal = grid => grid.map(row => row.split('').reverse().join(''));

const buildPhotoFromTiles = tiles => {
  const width = Math.sqrt(tiles.length);
  const photo = [];
  let rows;

  for (const [index, tile] of Object.entries(tiles)) {
    if (0 === index % width) {
      if (rows) {
        photo.push(...rows);
      }

      rows = Array(tiles[0].grid.length - 2).fill('');
    }

    for (let row = 0; row < tile.grid.length - 2; ++row) {
      const tileRow = tile.grid[row + 1];
      rows[row] += tileRow.substr(1, tileRow.length - 2);
    }
  }

  return [...photo, ...rows];
};

const countMonsters = (photo, monster) => {
  const monsterHashOffsets = monster.reduce(
    (offsets, row, rowIndex) => [...offsets, ...row.split('').flatMap(
      (col, colIndex) => '#' === col ? [[rowIndex, colIndex]] : []
    )],
    []
  );

  let count = 0;

  for (let row = 0; row < photo.length - monster.length + 1; ++row) {
    for (let col = 0; col < photo[row].length - monster[0].length + 1; ++col) {
      count += !monsterHashOffsets.some(
        ([offsetRow, offsetCol]) => '.' === photo[row + offsetRow][col + offsetCol]
      );
    }
  }

  return count;
};

const part1 = tiles => {
  const width = Math.sqrt(tiles.length);
  const cornerTiles = [0, width - 1, tiles.length - width, tiles.length - 1];

  return cornerTiles.reduce((product, index) => product * tiles[index].id, 1);
};

const part2 = tiles => {
  const photo = buildPhotoFromTiles(tiles);

  let monster = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ];

  let monsterCount = 0;

  for (let rotation = 0; rotation < 4; ++rotation) {
    monsterCount += countMonsters(photo, monster) + countMonsters(photo, flipHorizontal(monster));
    monster = rotateClockwise(monster);
  }

  const countHashes = grid => grid.reduce((sum, row) => sum + row.match(/#/g).length, 0);

  return countHashes(photo) - monsterCount * countHashes(monster);
};

const tiles = arrangeTiles(
  Object.fromEntries(readGroupedLines('input.txt').map(
    ([id, ...tile]) => [id.replace(/\D/g, ''), tile]
  ))
);

console.log(part1(tiles), part2(tiles));
