import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import './App.css';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { updateSearchCount } from './appwrite';
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [serachTerm, setSerachTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [deBounceSearchTerm, setDeBounceSearchTerm] = useState('');
  useDebounce(()=>setDeBounceSearchTerm(serachTerm), 1000,[serachTerm]);
  const fetchMovies = async (query = '') => {
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      const endpoint = query ?
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if (data.response == false) {
        setErrorMsg(data.Error || "Failed to fetch movies.");
        setMovieList([]);
      }
      setMovieList(data.results || []);
      if(query && data.results.length>0){
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log("Error loading API:", error);
      setErrorMsg(error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchMovies(deBounceSearchTerm);
  }, [deBounceSearchTerm]);
  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={serachTerm} setSerachTerm={setSerachTerm} />
        </header>
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          {isLoading ? (<Spinner />) : errorMsg ? (<p className='text-red-500'>{errorMsg}</p>) :
            (<ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>)
          }
        </section>
      </div>
    </main>
  )
}

export default App;