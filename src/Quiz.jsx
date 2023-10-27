import React, { useEffect, useState } from 'react';
import './Quiz.css';
import { decode } from 'html-entities';
import { nanoid } from 'nanoid';

export default function Quiz(props) {
  const questions = props.quiz;
  const [userAnswers, setUserAnswers] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [submit, setSubmit] = useState(false);
  console.log(props);

  useEffect(() => {
    const newArr = [];
    questions?.map(item => {
      newArr.push({
        question: decode(item.question),
        correctAnswer: decode(item.correct_answer),
        answers: shuffleArray([...item.incorrect_answers, item.correct_answer]),
      });
    });
    return setQuiz(newArr);
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleChange(event, questionId) {
    console.log(event, questionId);
    const userAnswer = [...userAnswers];
    const isCorrect = event === quiz[questionId]?.correctAnswer;
    userAnswer[questionId] = {
      question: quiz[questionId].question,
      isCorrect,
      answer: event,
      correctAnswer: quiz[questionId].correctAnswer,
    };
    setUserAnswers(userAnswer);
  }

  function checkButton() {
    setCompleted(prev => !prev);
  }

  function playAgain() {
    setCompleted(prev => !prev);
  }

  function calcCorrects() {
    const numberOfCorrects = userAnswers.filter(
      correct => correct.isCorrect
    ).length;

    return numberOfCorrects;
  }

  return (
    <div className="container">
      {quiz?.map((qsn, qsnIndex) => (
        <div key={qsnIndex}>
          <h2>{qsn?.question}</h2>
          <div className="button-wrapper">
            {qsn?.answers.map((ans, ansIndex) => (
              <div key={ansIndex}>
                <button
                  className={`input-btn ${
                    completed && userAnswers[qsnIndex]?.correctAnswer === ans
                      ? 'correct'
                      : completed &&
                        userAnswers[qsnIndex]?.correctAnswer !== ans &&
                        userAnswers[qsnIndex]?.answer === ans
                      ? 'incorrect'
                      : userAnswers[qsnIndex]?.answer === ans
                      ? 'selected'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    id={`q${qsnIndex}-a${ansIndex}`}
                    name={`q${qsnIndex}`}
                    onChange={() => handleChange(ans, qsnIndex)}
                  />
                  <label htmlFor={`q${qsnIndex}-a${ansIndex}`}>
                    {decode(ans)}
                  </label>
                </button>
              </div>
            ))}
          </div>

          <hr />
        </div>
      ))}

      {/* check btn */}
      {completed ? (
        <>
          <div className="play-again-container">
            <p>
              You scored {calcCorrects()}/{quiz.length} correct answers
            </p>
            <button onClick={props.changeLoad}>Play Again</button>
          </div>
        </>
      ) : (
        <button className="check-btn" onClick={checkButton}>
          Check answers
        </button>
      )}
    </div>
  );
}
