import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from './assets/Animation - 1698255886194.json';
import './App.css';
import Quiz from './Quiz';

function App() {
  const [quiz, setQuiz] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState('easy');
  const [formSubmit, setFormSubmit] = useState(false);

  const loadingAnimation = (
    <div className="load-data" onClick={changeLoad}>
      {firstLoad && !formSubmit ? (
        <h2 className="load-data-title">Let's Go To Quizzical...</h2>
      ) : (
        <h2 className="load-data-title">So You Think You Know It All?</h2>
      )}
      <Lottie animationData={animationData} />
    </div>
  );

  setTimeout(() => {
    setFirstLoad(false);
  }, 2000);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => setCategories(data.trivia_categories));
  }, []);

  function handleCategories(e) {
    setCategory(e.target.value);
  }

  function handleDifficulty(e) {
    setDifficulty(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();

    fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
    )
      .then(res => res.json())
      .then(data => setQuiz(data.results));

    setFormSubmit(true);
    setFirstLoad(true);

    setTimeout(() => {
      setFirstLoad(false);
    }, 2000);
  }

  const inputElements = (
    <div className="category-wrapper">
      <h1>Quizzical</h1>
      <form className="category-form" onSubmit={onSubmit}>
        <div>
          <label htmlFor="category">Select Category</label>
          <select name="category" id="category" onChange={handleCategories}>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty">Select Difficulty</label>
          <select name="difficulty" id="difficulty" onChange={handleDifficulty}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button type="submit">Start Quiz</button>
      </form>
    </div>
  );

  function changeLoad() {
    setFirstLoad(true);
    setFormSubmit(false);

    setTimeout(() => {
      setFirstLoad(false);
    }, 2000);
  }

  return (
    <>
      {firstLoad ? (
        loadingAnimation
      ) : !formSubmit ? (
        inputElements
      ) : (
        <Quiz quiz={quiz} changeLoad={changeLoad} />
      )}
    </>
  );
}

export default App;
