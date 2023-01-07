'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try{
        if(!req.body.puzzle || req.body.puzzle.trim() == '' || !req.body.coordinate || req.body.coordinate.trim() == '' 
        || !req.body.value || req.body.value.trim() == ''){
          return res.send({ error: 'Required field(s) missing' })
        }
        if(!solver.validateChars(req.body.puzzle)){
          return res.send({"error": "Invalid characters in puzzle"});
        }
        if(!solver.validateLength(req.body.puzzle)){
          return res.send({"error": "Expected puzzle to be 81 characters long"});
        }
        let value = parseInt(req.body.value);
        if(!value || value < 1 || value > 9){
          return res.send({error: "Invalid value"});
        }
        let rowCol = solver.parseCoordinate(req.body.coordinate);
        if(!rowCol){
          return res.send({error: "Invalid coordinate"});
        }
        let rowNum = rowCol[0];
        let colNum = rowCol[1];
        let checkPlacement = solver.checkPlacement(req.body.puzzle, rowNum, colNum, req.body.value);
        return res.send(checkPlacement);
      }catch(err){
        console.log(err);
      }
      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      try{
        if(!req.body.puzzle || req.body.puzzle.trim() == ''){
          return res.send({ error: 'Required field missing' })
        }
        if(!solver.validateChars(req.body.puzzle)){
          return res.send({"error": "Invalid characters in puzzle"});
        }
        if(!solver.validateLength(req.body.puzzle)){
          return res.send({"error": "Expected puzzle to be 81 characters long"});
        }
        let solvedPuzzle = solver.solve(req.body.puzzle);
        if(solvedPuzzle){
           res.send({solution:solvedPuzzle});
           return
        }else{
          return res.send({error: 'Puzzle cannot be solved'});
        }
      }catch(err){
        console.log(err);
      }
    });
};
