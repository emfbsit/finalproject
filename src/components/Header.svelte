<script>
	export let title = "Quiz Game";
</script>

<header>
	<h1>{title}</h1>
	<h2>Answer the question as many as you can!</h2>
</header>

<style>
	/* Base Header Style */
	header {
		background: var(--primary-clr);
		padding: 0.5em 1em;
		box-shadow: var(--shadow-lg);
		text-align: center;
		overflow: hidden;
		position: relative;
	}

	h1 {
		font-size: 2rem;
		margin: 0;
		color: white;
		font-family: 'Poppins', sans-serif;
		animation: slideIn 1s ease-out forwards;
	}

	h2 {
		font-size: 1.0rem; /* Adjusted to make it smaller */
		color: rgb(0, 0, 0);
		font-family: 'Poppins', sans-serif;
		margin-top: 0.5em;
		font-weight: 300; /* Makes the font thin */
	}
</style>
