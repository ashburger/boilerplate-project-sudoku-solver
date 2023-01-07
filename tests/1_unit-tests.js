const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const puzzleStrings = require('../controllers/puzzle-strings').puzzlesAndSolutions;

suite('Unit Tests', () => {
    let validPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

    test('Check validity of valid puzzle string', function(done){
        assert.isTrue(solver.validateChars(validPuzzleString));
        assert.isTrue(solver.validateLength(validPuzzleString));
        done();
    });

    test('Check validity of puzzle string with invalid characters', function(done){
        assert.isFalse(solver.validateChars('1.5..2.04..63.12.7.0..5..T..9..1..0.8.2.3G74.3.7.2..9.47...8..1..16....926914.37.'));
        done();
    });

    test('Check validity of puzzle string that is not 81 characters in length', function(done){
        assert.isFalse(solver.validateLength('1.5..2.04..63'));
        done();
    });

    test('Handle valid row placement', function(done){
        assert.deepEqual(solver.parseCoordinate('A5'), [0, 4]);
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 0, 4, '7'), {"valid":true});
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 3, 8, '7'), {"valid":false, "conflict":["column", "region"]});
        done();
    });

    test('Handle invalid row placement', function(done){
        assert.isFalse(solver.parseCoordinate('T3'));
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 5, 5, 9), { "valid": false, "conflict": [ "row" ] });
        done();
    });

    test('Handle valid column placement', function(done){
        assert.deepEqual(solver.parseCoordinate('G1'), [6, 0]);
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 6, 0, '4'), {"valid":true});
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 7, 4, '6'), {"valid":false, "conflict":["row", "region"]});
        done();
    });

    test('Handle invalid column placement', function(done){
        assert.isFalse(solver.parseCoordinate('D0'));
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 6, 2, '5'), {"valid":false, "conflict":["column"]});
        done();
    });

    test('Handle valid region placement', function(done){
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 1, 0, '9'), {"valid":true});
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 3, 8, '1'), {"valid":false, "conflict":["row", "column"]});
        done();
    });

    test('Handle invalid region placement', function(done){
        assert.deepEqual(solver.checkPlacement(validPuzzleString, 3, 3, '2'), {"valid":false, "conflict":["region"]});
        done();
    });

    test('Valid puzzle passes solver', function(done){
        for(let puzzle of puzzleStrings){
            assert.equal(solver.solve(puzzle[0]), puzzle[1]);
        }
        done();
    });

    test('Invalid puzzle fails solver', function(done){
        assert.isFalse(solver.validateChars('1.5..2.04..63.12.7.0.G5..3..9..1..0.8.2.3G74.3.7.2..9.47.D.8..1..10....920014.37.'));
        assert.isFalse(solver.validateLength('124...212....21...2'));
        done();
    });

    test('Solver returns expected solution for incomplete puzzle', function(done){
        assert.equal(solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
        '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
        done();

    });
});
