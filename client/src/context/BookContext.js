import {createContext} from 'react';

export const BookContext = createContext({
    books: [],
    setBooks: () => {}
})