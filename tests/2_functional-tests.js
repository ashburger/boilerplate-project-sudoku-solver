const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let validPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Functional Tests', () => {

    suite('Solve Tests', () => {
        
        test('Solve puzzle with valid puzzle string', function(done){
            chai.request(server)
            .post('/api/solve')
            .send({puzzle:validPuzzleString})
            .end(function(err, res){
                assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
                done();
            });
        });

        test('Solve puzzle with missing puzzle string', function(done){
            chai.request(server)
            .post('/api/solve')
            .end(function(err, res){
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
        });

        test('Solve puzzle with invalid characters', function(done){
            chai.request(server)
            .post('/api/solve')
            .send({puzzle:'1.5..2.84..63.12.A.2..50. .S90.1....8.2.3674.3.7.2i.9.47...8!.1..16...!9269F4.37.'})
            .end(function(err, res){
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
        });

        test('Solve puzzle with incorrect length', function(done){
            chai.request(server)
            .post('/api/solve')
            .send({puzzle:'1.5..2.84..63.1.5...926914.37.'})
            .end(function(err, res){
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
        });

        test('Solve puzzle that cannot be solved', function(done){
            chai.request(server)
            .post('/api/solve')
            .send({puzzle:'1155.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
            .end(function(err, res){
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
        });

    });

    suite('Check Tests', () => {

        test('Check a puzzle placement with all fields', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:validPuzzleString, coordinate:'A4', value:'7'})
            .end(function(err, res){
                assert.isTrue(res.body.valid);
                done();
            });
        });

        test('Check a puzzle placement with single placement conflict', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:validPuzzleString, coordinate:'D6', value:'8'})
            .end(function(err, res){
                assert.isFalse(res.body.valid);
                assert.deepEqual(res.body.conflict, ["column"]);
                done();
            });
        });

        test('Check a puzzle placement with multiple placement conflicts', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:validPuzzleString, coordinate:'B2', value:'7'})
            .end(function(err, res){
                assert.isFalse(res.body.valid);
                assert.deepEqual(res.body.conflict, ["row", "column"]);
                done();
            });
        });

        test('Check a puzzle placement with all placement conflicts', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:validPuzzleString, coordinate:'A4', value:'1'})
            .end(function(err, res){
                assert.isFalse(res.body.valid);
                assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
                done();
            });
        });

        test('Check a puzzle placement with missing required fields', function(done){
            chai.request(server)
            .post('/api/check')
            .end(function(err, res){
                assert.equal(res.body.error, "Required field(s) missing");
            });

            chai.request(server)
            .post('/api/check')
            .send({puzzle:validPuzzleString})
            .end(function(err, res){
                assert.equal(res.body.error, "Required field(s) missing");
                done();
            });
        });

        test('Check a puzzle placement with invalid characters', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:'1.5..2.84..63.12.A.2..50. .S90.1....8.2.3674.3.7.2i.9.47...8!.1..16...!9269F4.37.', coordinate:'A4', value:'2'})
            .end(function(err, res){
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
        });

        test('Check a puzzle placement with incorrect length', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:'1.5..2.84..63.12..1....8.2.3674.3.7.2.37.', coordinate:'A4', value:'2'})
            .end(function(err, res){
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
        });

        test('Check a puzzle placement with invalid placement coordinate', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:validPuzzleString, coordinate:'T0', value:'5'})
            .end(function(err, res){
                assert.deepEqual(res.body.error, 'Invalid coordinate');
                done();
            });
        });

        test('Check a puzzle placement with invalid placement value', function(done){
            chai.request(server)
            .post('/api/check')
            .send({puzzle:validPuzzleString, coordinate:'A1', value:'0'})
            .end(function(err, res){
                assert.deepEqual(res.body.error, 'Invalid value');
                done();
            });
        });
        
    })
});

