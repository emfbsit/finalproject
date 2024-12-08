<script>
	export let pending = false;
	export let correct = false;
	export let incorrect = false;
</script>

<button
	class:pending
	class:correct
	class:incorrect
	on:click
>
	<slot></slot>
</button>

<style>
	button {
		display: block;
		width: 100%;
		padding: 1em 2em;
		border: 2px solid var(--primary-clr-dark);
		font-weight: 700;
		color: white;
		background: var(--primary-clr);
		
		transition: background 120ms ease-in-out;
	}
	
	button:hover {
		background: var(--primary-clr-dark);
	}
	
	button:focus {
		outline: none;
		box-shadow: var(--shadow-outline);
	}
	
	button.pending {
		background: var(--yellow-clr);
		border-color: var(--yellow-clr-dark);
	}
	button.pending:hover {
		background: var(--yellow-clr-dark);
	}
	
	button.correct {
		background: var(--green-clr);
		border-color: var(--green-clr-dark);
	}
	button.correct:hover {
		background: var(--green-clr-dark);
	}
	
	button.incorrect {
		background: var(--red-clr);
		border-color: var(--red-clr-dark);
	}
	
	button.incorrect:hover {
		background: var(--red-clr-dark);
	}
</style>