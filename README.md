# tslint-newlines-between-tests

A tslint rule to ensure newlines between test members, for example, this

    describe('foo', () => {
        beforeAll(setup);
        afterAll(teardown);
        beforeEach(setup);
        afterEach(teardown);
        it('should foo', () => {});
        it('should not bar', () => {});
    });
    describe('bar', () => {
        beforeAll(setup);
        afterAll(teardown);
        beforeEach(setup);
        afterEach(teardown);
        it('should bar', () => {});
        it('should not foo', () => {});
    });

will become this:

    describe('foo', () => {
        beforeAll(setup);

        afterAll(teardown);

        beforeEach(setup);

        afterEach(teardown);

        it('should foo', () => {});

        it('should not bar', () => {});
    });

    describe('bar', () => {
        beforeAll(setup);

        afterAll(teardown);

        beforeEach(setup);

        afterEach(teardown);

        it('should bar', () => {});

        it('should not foo', () => {});
    });
