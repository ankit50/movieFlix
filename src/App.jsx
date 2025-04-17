import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
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

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
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
    } catch (error) {
      console.log("Error loading API:", error);
      setErrorMsg(error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchMovies();

  }, []);
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
          <h2>All Movies</h2>
          {isLoading ? (<p className='text-white'>Loading....</p>) : errorMsg ? (<p className='text-red-500'>{errorMsg}</p>) :
            (<ul>
                {movieList.map((movie) => (
                  <p className='text-white'>{movie.title}</p>
                ))}
            </ul>)
          }
        </section>
      </div>
    </main>
  )
}

export default App;