import { Arrays } from '..'

export namespace ReducerUtils {
    import mapValues = Arrays.mapValues

    /**
     * Reducer
     * @desc Type representing reducer handler
     */
    export type Reducer<S, A> = (state: S, action: A) => S

    export const createReducer = (initialState, handlers): any => {
        return (state = initialState, action): any => {
            return handlers[action.type](state, action)
        }
    }

    // Combine a map of slice reducers into a master reducer.
    export const combineReducers = <S, A>(...reducers: Reducer<S, A>[]): Reducer<S, A> => {
        return (state, action): any => {
            return mapValues(reducers, (reducer, key) => reducer(state[key], action))
        }
    }

    // Reduce the state using each reducer in the list in order.
    export const reduceReducers = <S, A>(...reducers: any[]): Reducer<S, A> => {
        return (state, action): any => {
            return reducers.reduce((state, reducer) => {
                return reducer(state, action)
            }, state)
        }
    }

    // Select a reducer based on a selector. The selector should return a boolean
    // for left/right selection.
    export const selectReducer = <S, A>(selector, leftReducer, rightReducer): Reducer<S, A> => {
        return (state, action): any => {
            return (selector(state, action) ? leftReducer : rightReducer)(state, action)
        }
    }

    export const filterActions = <S, A>(filter, reducer): Reducer<S, A> => {
        return (state, action): any => {
            return filter(action) ? reducer(state, action) : state
        }
    }
}
