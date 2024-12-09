<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { fly, fade } from "svelte/transition"
	import Button from "../shared/Button.svelte"
	
	const dispatch = createEventDispatcher()
	
	export let question: string
	export let correct_answer: string
	export let incorrect_answers: string[]

	enum Status {
		neutral = 0,
		pending = 1,
		correct = 2,
		incorrect = 3
	}
	
	// the message that displays when the player picks
	let choiceMsg = ""
	// whether or not the player is correct
	let playerCorrect: boolean
	let answers: { text: string; status: Status }[]
	// prevents spamming the same answer
	let answerIsPicked = false
	let timer = 30
	let countDownInterval
	
	const countDown = () => {
		timer--
		if (timer <= 0) {
			dispatch("answer", { playerCorrect })
			clearInterval(countDownInterval)
		}
	}
	
	$: {
		correct_answer = correct_answer
		choiceMsg = ""
		playerCorrect = undefined
		answerIsPicked = false
		countDownInterval = setInterval(countDown, 1000)
		timer = 30
		answers =
			// merge the answers
			[...incorrect_answers, correct_answer]
			// give each answer a status
			.map(answer => {
				return { text: answer, status: Status.neutral }
			})
			// shuffle the answers
			.sort((f, l) => Math.random() - 0.5)
	}
	
	const pickAnswer = (answer: { text: string; status: Status }): void => {
		if (answerIsPicked) { return }
		answerIsPicked = true
		
		clearInterval(countDownInterval)
		
		answers = answers.map(item => {
			return {...item, status: Status.pending}
		})
		
		setTimeout(() => {
			
			answers = answers.map(item => {
				if (item.text === correct_answer) {
					return {...item, status: Status.correct}
				} else {
					return {...item, status: Status.incorrect}
				}
			})
			
			if (answer.text === correct_answer) {
				choiceMsg = "Correct!"
				playerCorrect = true
			} else {
				choiceMsg = "Incorrect!"
				playerCorrect = false
			}
			
			setTimeout(() => {
				dispatch("answer", { playerCorrect })
			}, 1000)
		}, 2000)
	}
</script>

<article
	class="box"
	in:fly={{ x: -1000, duration: 1200 }}
	out:fly={{ x: 1000, duration: 1200 }}
>
	<h1>{@html question }</h1>
	
	<div class="answers">
		{#each answers as answer}
			<Button
				pending={answer.status === Status.pending}
				correct={answer.status === Status.correct}
				incorrect={answer.status === Status.incorrect}
				on:click={() => pickAnswer(answer)}
			>
				{@html answer.text }
			</Button>
		{/each}
	</div>
	<h3
		class:correct={playerCorrect}
		class:incorrect={!playerCorrect}
	>
		{ choiceMsg }
	</h3>
</article>
<div class="timer-container">
	<svg class="timer-circle" viewBox="0 0 100 100">
	  <!-- Background Circle -->
	  <circle class="bg" cx="50" cy="50" r="45"></circle>
	  <!-- Timer Progress Circle -->
	  <circle
		class="progress"
		cx="50"
		cy="50"
		r="45"
		style="stroke-dashoffset: calc(283 - (283 * {timer}) / 30);"
	  ></circle>
	  <!-- Correctly Centered Text -->
	  <g transform="translate(50, 50)">
		<text text-anchor="middle" transform="translate(-50, -50)" font-size="20" fill="black">{timer}</text>
	  </g>
	</svg>
  </div>  


<style>
	.box {
		background: white;
		box-shadow: var(--shadow-lg);
		padding: 1em;
		border-radius: 0.5em;
	}
	
	h1 {
		color: var(--heading-clr);
		font-size: 1.25rem;
		margin-bottom: 1.25em;
		padding-bottom: 1em;
		border-bottom: 3px solid var(--heading-clr);
	}
	
	:global(.answers > button + button) {
		margin-top: 1.4rem;
	}
	
	@media only screen and (min-width: 48rem) {
		.answers {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1rem;
		}
		
		:global(.answers > button + button) {
			margin-top: 0;
		}
	}
	
	h3 {
		font-size: 1.5rem;
		margin-top: 1.5em;
		text-align: center;
	}
	
	h3.correct {
		color: var(--green-clr);
	}
	
	h3.incorrect {
		color: var(--red-clr);
	}
	
	.timer-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 0;
	}

	.timer-circle {
		width: 100px;
		height: 100px;
		transform: rotate(-90deg);
	}

	.timer-circle .bg {
		fill: none;
		stroke: #e6e6e6;
		stroke-width: 10;
	}

	.timer-circle .progress {
		fill: none;
		stroke: var(--primary-clr, #4caf50); /* Default to green if not defined */
		stroke-width: 10;
		stroke-dasharray: 283;
		stroke-dashoffset: 283;
		transition: stroke-dashoffset 1s linear;
	}
</style>
