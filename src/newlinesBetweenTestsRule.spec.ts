import { getFixedResult, helper } from './lintRunner';
import { Rule } from './newlinesBetweenTestsRule';

const rule = 'newlines-between-tests';

describe('module-level tests', () => {
    it(`testing failure`, () => {
        const src = `
        test('foo', ()=>{});
        test('bar', ()=>{});`;
        const result = helper({ src, rule });
        expect(result.errorCount).toBe(1);
    });

    it(`testing not failure`, () => {
        const src = `
        test('foo', ()=>{});

        test('bar', ()=>{});`;
        const result = helper({ src, rule });
        expect(result.errorCount).toBe(0);
    });

    it(`testing position`, () => {
        const src = `
        test('foo', ()=>{});
        test('bar', ()=>{});`;
        const startPosition = src.indexOf(`test('bar`);
        const endPosition = startPosition + "test".length
        const failure = helper({ src, rule }).failures[0];

        expect(failure.getStartPosition().getPosition()).toEqual(startPosition);
        expect(failure.getEndPosition().getPosition()).toEqual(endPosition);
        expect(failure.getFailure()).toBe(Rule.FAILURE_STRING);
    });

    it(`testing failure message example`, () => {
        const src = `
        test('foo', ()=>{});
        test('bar', ()=>{});`;
        const failure = helper({ src, rule }).failures[0];

        expect(failure.getFailure()).toBe(Rule.FAILURE_STRING);
    });

    it('testing fixer example', () => {
        const src = `
        test('foo', ()=>{});
        test('bar', ()=>{});`;

        const output = `
        test('foo', ()=>{});

        test('bar', ()=>{});`;

        const result = helper({ src, rule });
        expect(result.errorCount).toBe(1);
        expect(getFixedResult({ src, rule })).toEqual(output);
    });
});


test(`fixing in a complex example`, () => {
    const src = `
        describe('foo', () => {
            beforeAll(setupAll);
            afterAll(setupAll);
            beforeEach(setupEach);
            afterEach(setupEach);
            it('should foo', () => {});
            it('should not bar', () => {});
        });
        describe('bar', () => {
            beforeAll(setupAll);
            afterAll(setupAll);
            beforeEach(setupEach);
            afterEach(setupEach);
            it('should bar', () => {});
            it('should not foo', () => {});
        });`;

    const output = `
        describe('foo', () => {
            beforeAll(setupAll);

            afterAll(setupAll);

            beforeEach(setupEach);

            afterEach(setupEach);

            it('should foo', () => {});

            it('should not bar', () => {});
        });

        describe('bar', () => {
            beforeAll(setupAll);

            afterAll(setupAll);

            beforeEach(setupEach);

            afterEach(setupEach);

            it('should bar', () => {});

            it('should not foo', () => {});
        });`;

    const result = helper({ src, rule });
    expect(result.errorCount).toBeGreaterThan(0);
    expect(getFixedResult({ src, rule })).toEqual(output);
});



