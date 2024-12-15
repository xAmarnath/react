import { useState, useEffect } from 'react';

function App() {
  const [movies, setMovies] = useState([]); // State to store movie data
  const [newMovie, setNewMovie] = useState({ name: '', year: '', rating: '' }); // State for new movie inputs

  // Fetch movies via fetch API
  useEffect(() => {
    fetch('http://localhost:3000/movies/stream')
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error('Error fetching movies:', err));
  }, []);

  // Handle input changes for the new movie form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  // Submit a new movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Movie added successfully!');
        setNewMovie({ name: '', year: '', rating: '' }); // Reset form
        setMovies((prevMovies) => [...prevMovies, newMovie]); // Add new movie to state
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error submitting movie:', err);
    }
  };

  // Delete a movie
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert('Movie deleted successfully!');
        setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id)); // Remove movie from state
      } else {
        alert('Failed to delete movie.');
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-4 flex flex-col lg:flex-row items-start justify-center lg:space-x-8">
      {/* Form to add a new movie */}
      <div className="w-full lg:w-1/3 bg-gray-700 p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-4 text-center text-cyan-400">🎬 Add Movie</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">
              Movie Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter movie name"
              value={newMovie.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-xs font-medium text-gray-300 mb-1">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              placeholder="Enter release year"
              value={newMovie.year}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="rating" className="block text-xs font-medium text-gray-300 mb-1">
              Rating
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              placeholder="Enter rating (0-10)"
              value={newMovie.rating}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              max="10"
              required
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-300 text-sm"
          >
            Add Movie
          </button>
        </form>
      </div>

      {/* Display list of movies */}
      <div className="w-full lg:w-2/3">
        <h1 className="text-xl font-semibold mb-4 text-center text-cyan-400">🎥 Movie List</h1>
        <ul className="space-y-3">
          {movies.map((movie) => (
            <li
              key={movie._id}
              className="bg-gray-800 p-3 rounded shadow flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-medium text-cyan-400">{movie.name}</h3>
                <p className="text-gray-400 text-xs">Year: {movie.year}</p>
                <p className="text-gray-400 text-xs">Rating: {movie.rating}</p>
              </div>
              <button
                onClick={() => handleDelete(movie._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
