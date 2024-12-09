<script>
	export let title = "Quiz Game";
</script>

<header>
	<h1>{title}</h1>
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

	/* Keyframes for Slide In */
	@keyframes slideIn {
		0% {
			transform: translateY(-100%);
			opacity: 0;
		}
		100% {
			transform: translateY(0%);
			opacity: 1;
		}
	}
</style>
