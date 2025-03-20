import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [word, setWord] = useState("");

  const getAnswerWord = async () => {
    const apiKey = "35bfca727cmsh7b6f51e1ef909efp188c39jsn164e594acb54";

    const url = `https://api.wordsapi.com/v2/words/random?api_key=${apiKey}`;
    try {
      const response = await fetch(
        `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key":
              "35bfca727cmsh7b6f51e1ef909efp188c39jsn164e594acb54",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (
          data.word.includes(" ") ||
          data.word.includes("-") ||
          data.word.includes("'")
        ) {
          getAnswerWord();
        } else {
          console.log("Random Word:", data.word);
          setWord(data.word);
        }
      } else {
        console.error("API error:", data);
      }
    } catch (error) {
      console.error("Error fetching random word:", error);
    }
  };

  useEffect(() => {
    getAnswerWord();
  }, []);

  const handleGuess = () => {
    if (currentGuess.length === 5 && currentRow < 6) {
      const newGuesses = [...guesses];
      const feedback = getFeedback(currentGuess, word);
      newGuesses[currentRow] = { guess: currentGuess.toUpperCase(), feedback };
      setGuesses(newGuesses);
      setCurrentRow(currentRow + 1);
      setCurrentGuess("");

      if (currentGuess === word) {
        setGameOver(true);
        alert("You win!");
      } else if (currentRow === 5) {
        setGameOver(true);
        alert("Game Over! The word was " + word);
      }
    }
  };

  const getFeedback = (guess, word) => {
    const feedback = [];
    let wordCopy = word.split("");

    for (let i = 0; i < 5; i++) {
      if (guess[i] === word[i]) {
        feedback[i] = "green";
        wordCopy[i] = null;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (!feedback[i] && wordCopy.includes(guess[i])) {
        feedback[i] = "yellow";
        wordCopy[wordCopy.indexOf(guess[i])] = null;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (!feedback[i]) feedback[i] = "gray";
    }

    return feedback;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !gameOver) {
      handleGuess();
    }
  };

  return (
    <div className="App">
      <h1>Wordle Clone</h1>

      <div className="word-grid">
        {guesses.map((guessObj, index) => (
          <div key={index} className="word-row">
            {guessObj.guess &&
              guessObj.guess.split("").map((letter, i) => (
                <div key={i} className={`letter ${guessObj.feedback[i]}`}>
                  {letter}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          type="text"
          value={currentGuess}
          maxLength="5"
          onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
          onKeyPress={handleKeyPress}
          disabled={gameOver}
        />
        <button onClick={handleGuess} disabled={gameOver}>
          Guess
        </button>
      </div>

      <div className="keyboard">
        {"qwertyuiop".split("").map((key) => (
          <button
            className="letterBtn"
            key={key}
            onClick={() => setCurrentGuess(currentGuess + key)}
          >
            {key}
          </button>
        ))}
        {"asdfghjkl".split("").map((key) => (
          <button
            className="letterBtn"
            key={key}
            onClick={() => setCurrentGuess(currentGuess + key)}
          >
            {key}
          </button>
        ))}
        <button className="clearBtn" onClick={() => setCurrentGuess("")}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default App;
