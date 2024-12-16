import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function App() {
  const [movies, setMovies] = useState([]); // State to store movie data
  const [newMovie, setNewMovie] = useState({ name: '', year: '', rating: '' }); // State for new movie inputs

  // Fetch movies via fetch API
  useEffect(() => {
    fetch('/api/movies/stream')
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
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Success', 'Movie added successfully!', 'success');
        setNewMovie({ name: '', year: '', rating: '' }); // Reset form
        setMovies((prevMovies) => [...prevMovies, { ...newMovie, _id: data.id }]); // Add new movie to state
      } else {
        Swal.fire(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error submitting movie:', err);
    }
  };

  // Delete a movie
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        Swal.fire('Movie deleted successfully! 🎉', '', 'success');
        setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id)); // Remove movie from state
      } else {
        Swal.fire('Failed to delete movie.');
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white min-h-screen p-6 flex flex-col lg:flex-row items-start justify-center lg:space-x-10">
      {/* Form to add a new movie */}
      <div className="w-full lg:w-1/3 bg-gray-800 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
        <h1 className="text-2xl font-bold mb-6 text-center text-cyan-400">🎬 Add Movie</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Add Movie
          </button>
        </form>
      </div>

      {/* Display list of movies */}
      <div className="w-full lg:w-2/3">
        <h1 className="text-2xl font-bold mb-6 text-center text-cyan-400">🎥 Movie List</h1>
        <ul className="space-y-4">
          {movies.map((movie) => (
            <li
              key={movie._id}
              className="bg-gray-800 p-5 rounded-lg shadow-lg flex items-center justify-between transition-transform hover:scale-105"
            >
              <div>
                <h3 className="text-lg font-semibold text-cyan-400">{movie.name}</h3>
                <p className="text-gray-400 text-sm">Year: {movie.year}</p>
                <p className="text-gray-400 text-sm">Rating: {movie.rating}</p>
              </div>
              <button
                onClick={() => handleDelete(movie._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
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
