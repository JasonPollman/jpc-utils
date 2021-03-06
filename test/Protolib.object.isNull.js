(function () {
    'use strict';

    var expect;
    if(typeof window === 'object' && window.expect) {
        expect = window.expect;
    }
    else {
        expect = require('chai').expect;
    }

    describe('Protolib.object.isNull', function () {

        var lib;
        before(function () {
            if(typeof window !== 'object') {
                lib = new (require('../'))('_');
            }
            else {
                lib = window.protolib;
            }
        });

        it('It should return true if and only if all arguments are null', function () {
            expect(lib.object.isNull(null)).to.equal(true);
            expect(lib.object.isNull(null, null)).to.equal(true);
            expect(lib.object.isNull(null, null, null)).to.equal(true);
            expect(lib.object.isNull(null, null, null, null)).to.equal(true);
            expect(lib.object.isNull(null, null, null, null)).to.equal(true);
            expect(lib.object.isNull()).to.equal(true);

            expect(lib.object.isNull(5)).to.equal(false);
            expect(lib.object.isNull('')).to.equal(false);
            expect(lib.object.isNull('string')).to.equal(false);
            expect(lib.object.isNull(function () {})).to.equal(false);
            expect(lib.object.isNull({})).to.equal(false);

            expect(lib.object.isNull(null, 5)).to.equal(false);
            expect(lib.object.isNull(null, '')).to.equal(false);
            expect(lib.object.isNull(null, 'string')).to.equal(false);
            expect(lib.object.isNull(null, function () {})).to.equal(false);
            expect(lib.object.isNull(null, {})).to.equal(false);

            expect(lib.object.isNull(null, null, 5)).to.equal(false);
            expect(lib.object.isNull(null, null, '')).to.equal(false);
            expect(lib.object.isNull(null, null, 'string')).to.equal(false);
            expect(lib.object.isNull(null, null, function () {})).to.equal(false);
            expect(lib.object.isNull(null, null, {})).to.equal(false);

            expect(lib.object.isNull(null, null, 5, null)).to.equal(false);
            expect(lib.object.isNull(null, null, '', null)).to.equal(false);
            expect(lib.object.isNull(null, null, 'string', null)).to.equal(false);
            expect(lib.object.isNull(null, null, function () {}, null)).to.equal(false);
            expect(lib.object.isNull(null, null, {}, null)).to.equal(false);

            expect(lib.object.isNull(undefined)).to.equal(false);
            expect(lib.object.isNull(undefined, null)).to.equal(false);
            expect(lib.object.isNull(null, undefined)).to.equal(false);

            expect((5)._.isNull()).to.equal(false);
            expect(('string')._.isNull()).to.equal(false);
            expect(({})._.isNull()).to.equal(false);
            expect(([])._.isNull()).to.equal(false);
        });
    });

}());
