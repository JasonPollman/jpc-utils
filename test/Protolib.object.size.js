(function () {
    'use strict';

    var expect;
    if(typeof window === 'object' && window.expect) {
        expect = window.expect;
    }
    else {
        expect = require('chai').expect;
    }

    describe('Protolib.object.size', function () {
        var lib;
        before(function () {
            if(typeof window !== 'object') {
                lib = new (require('../'))('_');
            }
            else {
                lib = window.protolib;
            }
        });

        // Create some test data
        var obj    = { foo: 'bar', num: 2, bool: false },
            eobj   = {},
            string = 'string',
            estr   = '',
            number = 124323,
            float  = 1324.234,
            func   = function () { console.log('HELLO WORLD!'); },
            subarr = [1, 2, 3],
            earr   = [];

        it('It should return the correct number of members given an object', function () {
            var o = obj._.size();
            expect(o).to.equal(3);

            o = eobj._.size();
            expect(o).to.equal(0);

            var oobj = { foo: 'hello', bar: 'world' };

            var res = oobj
                ._.invert()
                ._.histogram()
                ._.size();

            expect(res).to.equal(2);
        });

        it('It should return the correct number of members given undefined', function () {
            expect(lib.object.size(undefined)).to.equal(0);
            expect(lib.object.size(undefined, undefined)).to.equal(0);
            expect(lib.object.size()).to.equal(0);
        });

        it('It should return the correct number of members given null', function () {
            expect(lib.object.size(null)).to.equal(0);
            expect(lib.object.size(null, null)).to.equal(0);
        });

        it('It should return 0 for booleans', function () {
            expect(true._.size()).to.equal(0);
            expect(false._.size()).to.equal(0);
        });

        it('It should return the correct number of members given an array', function () {
            var o = subarr._.size();
            expect(o).to.equal(3);

            o = earr._.size();
            expect(o).to.equal(0);
        });

        it('It should return the correct number of members given a string', function () {
            var o = string._.size();
            expect(o).to.equal(6);

            o = estr._.size();
            expect(o).to.equal(0);
        });

        it('It should return the correct number of members given a number', function () {
            var o = number._.size();
            expect(o).to.equal(6);

            o = float._.size();
            expect(o).to.equal(8);
        });

        it('It should return the correct number of members given a function', function () {
            var o = func._.size();
            expect(o).to.equal(1);
        });

        it('It should return the correct number of members given an Arguments object', function () {
            (function () {
                expect(arguments._.size()).to.equal(6);
            }(1, 2, 3, 4, 5, 6));

            (function () {
                expect(arguments._.size()).to.equal(1);
            }(1));

            (function () {
                expect(arguments._.size()).to.equal(0);
            }());

            (function () {
                expect(arguments._.size()).to.equal(10);
            }(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
        });
    });
}());
