import React from 'react'

function Search({ searchTerm, setSerachTerm }) {
    return (
        <div className='search'>
            <div>
                <img src='search.svg' alt='search' />
                <input
                    type='text'
                    placeholder='Search Movies....'
                    value={searchTerm}
                    onChange={(e) => setSerachTerm(e.target.value)}
                ></input>
            </div>
        </div>
    )
}

export default Search; 