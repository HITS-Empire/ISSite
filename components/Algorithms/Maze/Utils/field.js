import { sleep } from "../../../../utils/sleep";

// Получить поле размером N x N
export function getField(count) {
    let field = new Array(count).fill(null).map(() => new Array(count).fill(null));

    for (let h = 0; h < count; h++) {
      for (let w = 0; w < count; w++) {
        field[w][h] = 1;
      }
    }

    let y=0;
    let x=0;

    if(field[x] && field[x][y]) {
      field[x][y] = 0;
    }
    
   
    let to_check = [];
    
    if (y - 2 >= 0) {
      to_check.push({ x: x, y: y - 2 });
    }

    if (y + 2 < count) {
      to_check.push({ x: x, y: y + 2 });
    }

    if (x - 2 >= 0) {
      to_check.push({ x: x - 2, y: y });
    }

    if (x + 2 < count) {
      to_check.push({ x: x + 2, y: y });
    }
  
    while (to_check.length > 0) {
      let index = Math.floor(Math.random() * to_check.length);
      let cell = to_check[index];

      x = cell.x;
      y = cell.y;
      
      if(field[x] && field[x][y]) {
          field[x][y] = 0;
      }
      
      to_check.splice(index, 1);
  
      let directions = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
      while (directions.length > 0) {
        let dirIndex = Math.floor(Math.random() * directions.length);
        
        switch (directions[dirIndex]) {
          case 'NORTH':
            if (y - 2 >= 0 && field[x][y - 2] == 0) {
              field[x][y - 1] = 0;
              directions = [];
            }
            break;
          
          case 'SOUTH':
            if (y + 2 < count && field[x][y + 2] == 0){
              field[x][y + 1] = 0;
              directions = [];
            }
            break;

          case 'EAST':
            if (x - 2 >= 0 && field[x - 2][y] == 0) {
              field[x - 1][y]=0;
              directions = [];
            }
            break;
          case 'WEST':
            if (x + 2 < count && field[x + 2][y] == 0){
              field[x + 1][y]=0;
              directions = [];
            }
            break;
        }

        directions.splice(dirIndex, 1);
      }
  
      if (y - 2 >= 0 && field[x][y - 2]==1) {
        to_check.push({ x: x, y: y - 2 });
      }

      if (y + 2 < count && field[x][y + 2]==1) {
        to_check.push({ x: x, y: y + 2 });
      }

      if (x - 2 >= 0 && field[x - 2][y]==1) {
        to_check.push({ x: x - 2, y: y });
      }

      if (x + 2 < count && field[x + 2][y]==1) {
        to_check.push({ x: x + 2, y: y });
      }
  }

  for (let i = 0; i < 2; i++) {
    let dead_ends=[];
      
    for(let h = 0; h < count; h++){
      for(let w = 0; w < count ;w++){
            
        if(field[w][h] == 0){
          let neighbors = 0;
                
          if(h - 1 >= 0 && field[w][h - 1]==0){
            neighbors++;
          }

          if(h + 1 < count && field[w][h + 1]==0){
            neighbors++;
          }
    
          if(w - 1 >= 0 && field[w - 1][h] == 0){
            neighbors++;
          }
    
          if(w + 1 < count && field[w + 1][h] == 0){
            neighbors++;
          }
            
          if(neighbors <= 1){
            dead_ends.push({x:w,y:h});
          }
        }
      }
    }
    
    for(let cell of dead_ends) {
      field[cell.x][cell.y] = 1;
    }
  }  

  if (count != 0){
      field[0][0] = 2;
  }

  if (count - 1 >= 0){
      field[count - 1][count - 1] = 3;
  }

  for (let i = 0; i < 3 && i < count - 1; i++){ 
      for (let j = 0; j < 3 && j < count - 1;j++){
          if (field[i][j] == 1) {
              field[i][j] = 0;
          }

          else if (field[j][i] == 1) {
              field[j][i] = 0;
          }

          else break;
      }
  }

  for (let i = count - 1; i >= 0 && i > count - 4; i--){ 
      for (let j = count - 1; j >= 0 && j > count - 4; j--){
          if (field[i][j] == 1) {
              field[i][j] = 0;
          }

          else if (field[j][i] == 1) {
              field[j][i] = 0;
          }

          else break;
      }
  }

return {
  field,
  startCell: {
      row: 0,
      column: 0
  },
  endCell: {
      row: count - 1,
      column: count - 1
  }
};
}

// Получить поле для поиска пути
export function getExtendedField(field) {
    return field.map((line, row) => {
        return line.map((cell, column) => ({
            row,
            column,
            type: cell,
            move: -1
        }));
    });
}

// Проверить, не выходим ли за границы поля
export function cellIsExists(row, column, count) {
    return 0 <= row && row < count && 0 <= column && column < count;
}

// Получить следующую итерацию
export function getNextCell(i, { row, column }) {
    switch (i) {
        case 0:
            row++;
            break;
        case 1:
            row--;
            break;
        case 2:
            column++;
            break;
        case 3:
            column--;
    }

    return { row, column };
}

// Построить путь
export function constructPath({
    count,
    field,
    setField,
    endCell,
    extendedField
}) {
    // Обновить поле перед проходом
    setField((field) => field);

    let extendedCell = extendedField[endCell.row][endCell.column];
    let step = extendedCell.move;

    while (step > 1) {
        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, extendedCell);

            if (!cellIsExists(row, column, count)) continue;
            if (extendedField[row][column].move === -1) continue;
            if (extendedField[row][column].move >= step) continue;
            if (extendedField[row][column].type) continue;

            field[row][column] = 5;
            extendedCell = extendedField[row][column];
            step = extendedCell.move;
            break;
        }
    }

    setField([...field]);
}

// Найти путь до конца поля
export async function findPathInField({
    count,
    field,
    setField,
    startCell,
    endCell,
    setStatus
}) {
    const extendedField = getExtendedField(field);

    extendedField[startCell.row][startCell.column].move = 0;

    const queue = [extendedField[startCell.row][startCell.column]];
    let step = 0;

    while (queue.length) {
        const extendedCell = queue.shift();

        if (extendedCell.move > step) {
            setField([...field]);
            step++;

            await sleep(50);
        }

        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, extendedCell);

            if (!cellIsExists(row, column, count)) continue;
            if (extendedField[row][column].move !== -1) continue;

            if (extendedField[row][column].type === 0 || extendedField[row][column].type === 3) {
                extendedField[row][column].move = extendedCell.move + 1;
            }

            // Нашли конец пути
            if (extendedField[row][column].type === 3) {
                constructPath({
                    count,
                    field,
                    setField,
                    endCell,
                    extendedField
                });

                return setStatus("success");
            }

            if (extendedField[row][column].type) continue;

            field[row][column] = 4;
            queue.push(extendedField[row][column]);
        }
    }

    setStatus("error");
}
