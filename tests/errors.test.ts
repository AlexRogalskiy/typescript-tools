import { describe } from '@jest/globals'

import { Errors } from '../src'
import { ErrorType } from '../typings/domain-types'

export namespace Errors_Test {
    import ExtendableError = Errors.ExtendableError;

    class TestError extends ExtendableError {
    }

    class SubTestError extends TestError {
    }

    describe('Test extendable error type', () => {
        beforeAll(() => {
            console.log("Test suite started")
            console.time("Execution time took")
        });

        afterAll(() => {
            console.log("Test suite finished")
            console.timeEnd("Execution time took")
        });

        it('it should be a valid error instance of', () => {
            const err = new ExtendableError(ErrorType.value_error, 'Value error')
            expect(err).toBeInstanceOf(Error)
            expect(err).toBeInstanceOf(ExtendableError);

            const err2 = new TestError(ErrorType.type_error, 'Type error')
            expect(err2).toBeInstanceOf(Error)
            expect(err2).toBeInstanceOf(ExtendableError)
            expect(err2).toBeInstanceOf(TestError)

            const err3 = new SubTestError(ErrorType.validation_error, 'Validation error')
            expect(err3).toBeInstanceOf(Error)
            expect(err3).toBeInstanceOf(ExtendableError)
            expect(err3).toBeInstanceOf(TestError)
            expect(err3).toBeInstanceOf(SubTestError)
        })

        it('it should be a valid error type', () => {
            const err = new ExtendableError(ErrorType.value_error, 'Value error')
            expect(err.name).toEqual('ExtendableError')

            const err2 = new TestError(ErrorType.value_error, 'Validation error');
            expect(err2.name).toEqual('TestError')

            const err3 = new SubTestError(ErrorType.value_error, 'Type error')
            expect(err3.name).toEqual('SubTestError')
        })

        it('it should be a valid error properties not enumerable', () => {
            const err = new ExtendableError(ErrorType.value_error, 'Value error')
            expect(err.propertyIsEnumerable('name')).toBeFalsy()
            expect(err.propertyIsEnumerable('message')).toBeFalsy()
            expect(err.propertyIsEnumerable('type')).toBeFalsy()
            expect(err.propertyIsEnumerable('stack')).toBeFalsy()
        })

        it('it should be a valid error stack message', () => {
            const err = new ExtendableError(ErrorType.value_error, 'Value error')
            expect(err.stack?.substring(0, 28)).toEqual('ExtendableError: Value error')

            const err2 = new TestError(ErrorType.validation_error, 'Validation error')
            expect(err2.stack?.substring(0, 27)).toEqual('TestError: Validation error')

            const err3 = new SubTestError(ErrorType.type_error, 'Type error')
            expect(err3.stack?.substring(0, 24)).toEqual('SubTestError: Type error')
        })

        it('it should be a valid error #toString', () => {
            const err = new ExtendableError(ErrorType.value_error, 'Value error')
            expect(err.toString()).toEqual('ExtendableError: Value error')

            const err2 = new TestError(ErrorType.validation_error, 'Validation error')
            expect(err2.toString()).toEqual('TestError: Validation error')

            const err3 = new SubTestError(ErrorType.type_error, 'Type error')
            expect(err3.toString()).toEqual('SubTestError: Type error')
        })

        it('it should be a valid error type string', () => {
            const err = new ExtendableError(ErrorType.value_error, 'Value error')
            expect(err['type']).toEqual(ErrorType.value_error)

            const err2 = new TestError(ErrorType.validation_error, 'Validation error')
            expect(err2['type']).toEqual(ErrorType.validation_error)

            const err3 = new SubTestError(ErrorType.type_error, 'Type error')
            expect(err3['type']).toEqual(ErrorType.type_error)
        })

        it('it should be a valid error message', () => {
            const err = new ExtendableError(ErrorType.value_error, 'Value error')
            expect(err.message).toEqual('Value error')
        })
    })
}


