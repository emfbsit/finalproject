<script lang="ts">
	import { questionStore } from "./stores";
	import Header from "./components/Header.svelte";
	import Question from "./components/Question.svelte";
	import Bouncer from "./shared/Bouncer.svelte";
	import Splitter from "./shared/Splitter.svelte";
  
	let score = 0;
	let lives = 3;
	let sessionToken;
	let difficulty = "easy";
	let highScore = localStorage.getItem("highScore") ? Number(localStorage.getItem("highScore")) : 0;
	let lifeLost = false; // Trigger for losing a life animation
	let gameOver = false; // Trigger for game over animation
	let scoreUpdated = false; // Trigger for score update animation
  
	// Automatic subscription
	let questions: object[];
	let currentQuestion: undefined | object;
  
	$: questions = $questionStore;
  
	const setup = async () => {
	  sessionToken = await questionStore.getSessionToken();
	  await questionStore.loadQuestions(difficulty, sessionToken);
	  displayNextQuestion();
	};
  
	const handleAnswer = (ev: CustomEvent): void => {
	  if (ev.detail.playerCorrect) {
		score++;
		scoreUpdated = true; // Trigger the score animation
		setTimeout(() => (scoreUpdated = false), 500); // Reset the animation flag
		scaleDifficulty();
		displayNextQuestion();
	  } else {
		lives--;
		lifeLost = true; // Trigger the life loss animation
		if (lives === 0) {
		  gameOver = true; // Trigger the game over animation
		  checkHighScore();
		  setTimeout(reset, 2000); // Wait for animation to finish before resetting the game
		} else {
		  displayNextQuestion();
		  setTimeout(() => {
			lifeLost = false; // Reset animation flag
		  }, 500);
		}
	  }
	};
  
	const displayNextQuestion = () => {
	  currentQuestion = undefined;
  
	  setTimeout(() => {
		currentQuestion = questions.shift();
		if (questions.length <= 3 && questions.length > 0) {
		  questionStore.loadQuestions(difficulty, sessionToken);
		}
	  }, 1200);
	};
  
	const scaleDifficulty = () => {
	  if (score < 10) {
		difficulty = "easy";
	  } else if (score < 20) {
		difficulty = "medium";
	  } else {
		difficulty = "hard";
	  }
	};
  
	const checkHighScore = () => {
	  if (score > highScore) {
		highScore = score;
		localStorage.setItem("highScore", String(highScore));
	  }
	};
  
	const reset = () => {
	  score = 0;
	  lives = 3;
	  gameOver = false; // Reset the game over flag
	  displayNextQuestion();
	};
  </script>
  
  <Header></Header>
  
  <main>
	{#await setup()}
	  <Bouncer></Bouncer>
	{:then}
	  <Splitter>
		<h3 id="score" class:score-updated={scoreUpdated}>Score: {score}</h3>
		<h3 id="lives" class:life-lost={lifeLost} class:game-over={gameOver}>Lives: {lives}</h3>
		<h3 id="highScore">High Score: {highScore}</h3>
	  </Splitter>
  
	  {#if currentQuestion}
		<Question
		  on:answer="{handleAnswer}"
		  {...currentQuestion}
		></Question>
	  {/if}
	{/await}
  </main>
  
  <style>
	main {
	  width: 85%;
	  max-width: 75rem;
	  min-height: 100%;
	  margin: 1.2rem auto 10rem;
	  padding: 0 0.5em;
	}
  
	:global(.bouncer) {
	  margin: 3.25rem auto;
	}
  
	#score, #lives, #highScore {
	  font-weight: 700;
	  font-size: 1.2rem;
	  margin: 0 0 0.5em;
	}
  
	/* Animation for score update */
	@keyframes scoreFlash {
	  0% { color: white; }
	  50% { color: limegreen; transform: scale(1.2); }
	  100% { color: white; transform: scale(1); }
	}
  
	.score-updated {
	  animation: scoreFlash 0.5s ease;
	}
  
	/* Animation for losing a life */
	@keyframes shake {
	  0% { transform: translateX(0); }
	  25% { transform: translateX(-5px); }
	  50% { transform: translateX(5px); }
	  75% { transform: translateX(-5px); }
	  100% { transform: translateX(0); }
	}
  
	.life-lost {
	  animation: shake 0.5s ease;
	}
  
	/* Game over animation */
	@keyframes gameOverShake {
	  0% { transform: scale(1); opacity: 1; }
	  50% { transform: scale(1.2); opacity: 0.5; }
	  100% { transform: scale(1); opacity: 1; }
	}
  
	.game-over {
	  color: red;
	  animation: gameOverShake 1s ease;
	  font-size: 1.5rem;
	  font-weight: bold;
	}
  </style>
  