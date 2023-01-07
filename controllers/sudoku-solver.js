class SudokuSolver {

  validateLength(puzzleString) {
    return puzzleString.length == 81;
  }
  validateChars(puzzleString){
    return puzzleString.replace(/[1-9.]/g, '').length == 0;
  }

  checkPlacement(puzzleString, row, column, value){
    // row and column starts at 0, and ends at 8, instead of 1 and 9, which is what the user inputs
    let valid = true;
    let conflict = [];

    // Check row placement
    let rowToCheck = puzzleString.substring(row * 9, 9 * (row + 1));
    let tempRow = rowToCheck.substring(0, column) + value + rowToCheck.substring(column+1);
    if(tempRow.split(value).length != 2){
      valid = false;
      conflict.push("row");
    }

    // Check column placement
    // get column string
    let colToCheck = '';
    for(let strPos=column;strPos<puzzleString.length;strPos+=9){
      colToCheck += puzzleString.charAt(strPos);
    }
    // check if value is valid in column
    let tempCol = colToCheck.substring(0, row) + value + colToCheck.substring(row+1);
    if(tempCol.split(value).length != 2){
      valid = false;
      conflict.push("column");
    }
    
    // Check region placement
    // get the region and put it to a string
    let startingRow = Math.floor(row/3) * 3; // get the starting row of the region of the coordinate
    let startingCol = Math.floor(column/3) * 3; // get the starting column of the region of the coordinate
    let startPos = this.getStringPos(startingRow, startingCol); // get the starting position of the region in the puzzleString
    let regionToCheck = '';
    for(let i=0; i<3;i++){
      regionToCheck += puzzleString.substring(startPos, startPos+3);
      startPos += 9;
    }
    // check if value is valid in region
    let relativeRowPos = row - 3 * Math.floor(row/3); 
    let relativeColPos = column - 3 * Math.floor(column/3);
    let relativeStringPos = relativeRowPos * 3 + relativeColPos; // find the relative position of the coordinate entered to the region string
    let tempRegion = regionToCheck.substring(0, relativeStringPos) + value + regionToCheck.substring(relativeStringPos + 1);
    if(tempRegion.split(value).length != 2){
      valid = false;
      conflict.push("region");
    }
    
    // return validity and conflicts
    if(valid){
      return {"valid":true};
    }else{
      return {"valid":false, "conflict":conflict}
    }
  }

  solve(puzzleString) {
    let row = -1;
    let col = -1;
    let isEmpty = true;
    // get the first empty space.
    for(let r = 0; r < 9; r++)
    {
        for(let c = 0; c < 9; c++)
        {
          let position = this.getStringPos(r, c);
            if (puzzleString.charAt(position) == '.')
            {
              row = r;
              col = c;
              // We still have missing spaces
              isEmpty = false;
              break;
            }
        }
        // puzzle is incomplete
        if (!isEmpty)
        {
          break;
        }
    }

    // No empty space left (puzzle completed)
    if (isEmpty)
    {
      return puzzleString;
    }

    // Else for each-row backtrack
    for(let num = 1; num <= 9; num++)
    {
      let isSafe = this.checkPlacement(puzzleString, row, col, num.toString());
      // if value is valid for current position, then 'fill it in', if not try with next value
      if (isSafe.valid)
      {
        let position = this.getStringPos(row, col);
        puzzleString = puzzleString.substring(0, position) + num.toString() + puzzleString.substring(position + 1);
        let tempSolvedPuzzle = this.solve(puzzleString, 9);
          if (tempSolvedPuzzle)
          {
            // when this block is reached, puzzle is solved, and completed
            puzzleString = tempSolvedPuzzle;
            return puzzleString;
          }
          else
          {  
            // backtrack occurs and unfills the position to test for the next value
            puzzleString = puzzleString.substring(0, position) + '.' + puzzleString.substring(position + 1);
          }
      }
    }
    // if after iterating over all possible values (1-9), a valid position isn't found
    // backtracking will occur, and the previously filled position will try for the next possible value.
    return false;
  }

  // parses a coordinate to numbers of range 0 - 8 to match indexes
  parseCoordinate(coord){
    if(!coord || coord.length !== 2){
      return false;
    }
    // get row value from letter to number by subracting by ascii value of the character 'A' (65)
    let rowCoord = coord.charAt(0).toUpperCase();
    let rowNum = rowCoord.charCodeAt(0) - 65;
    if(rowNum < 0 || rowNum > 8){
        return false;
    }
    let columnNum = Number(coord.charAt(1));
    if(!columnNum || columnNum < 1 || columnNum > 9){
      return false;
    }
    return [rowNum, columnNum - 1];
  }

  // get the index of a coordinate in the puzzle string 
  getStringPos(rowNum, column){
    return rowNum * 9 + column;
  }

}

module.exports = SudokuSolver;

