<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// TypeScript declarations for window globals
	declare global {
		interface Window {
			Materialize?: {
				toast: (message: string, duration: number) => void;
			};
		}
	}

	// Nyan cat animation state
	let nyanStyle = $state({ left: '100px', top: '100px' });

	// Copy reset link to clipboard
	function copyToClipboard(text: string) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard
				.writeText(text)
				.then(() => {
					if (window.Materialize) {
						window.Materialize.toast('Reset link copied to clipboard!', 3000);
					}
				})
				.catch((err) => {
					console.error('Failed to copy:', err);
					fallbackCopyTextToClipboard(text);
				});
		} else {
			fallbackCopyTextToClipboard(text);
		}
	}

	function fallbackCopyTextToClipboard(text: string) {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.top = '0';
		textArea.style.left = '0';
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = '0';
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand('copy');
			if (successful && window.Materialize) {
				window.Materialize.toast('Reset link copied to clipboard!', 3000);
			} else if (window.Materialize) {
				window.Materialize.toast('Failed to copy reset link', 3000);
			}
		} catch (err) {
			if (window.Materialize) {
				window.Materialize.toast('Failed to copy reset link', 3000);
			}
		}

		document.body.removeChild(textArea);
	}

	onMount(() => {
		if (!data.isAdmin && typeof window !== 'undefined') {
			// Initialize Nyan cat animation
			let posX = 100,
				posY = 100,
				px = 0,
				py = 0,
				an = false;
			const altura = 800;
			const largura = window.innerWidth;
			const tamanhoTela = Math.floor(largura / 9);
			const pilha: number[] = [];

			// Handle mouse movement
			document.addEventListener('mousemove', (event) => {
				posX = event.pageX;
				posY = event.pageY;
			});

			// Create rainbows
			for (let i = 0; i < tamanhoTela; i++) {
				const rain = document.createElement('div');
				rain.className = 'rainbow';
				rain.style.left = i * 9 + 'px';
				document.body.appendChild(rain);
			}
			const rainbows = document.querySelectorAll('.rainbow');

			// Create stars
			function criarEstrela() {
				const rand = getRandomInt(3, 14);
				const tempoDeVida = getRandomInt(5, 10);
				const star = document.createElement('div');
				star.className = 'star';
				star.style.width = rand + 'px';
				star.style.height = rand + 'px';
				star.style.left = largura - 10 + 'px';
				star.style.top = Math.floor(Math.random() * altura + 1) + 'px';
				star.style.transition = 'all ' + tempoDeVida + 's linear';
				star.style.transform = 'translate(0px, 0px)';
				document.body.appendChild(star);

				setTimeout(() => {
					star.style.transform = 'translate(-' + largura + 'px, 0px)';
				}, getRandomInt(5, 10) * 10);

				setTimeout(() => {
					star.remove();
				}, tempoDeVida * 1000);
			}

			function getRandomInt(min: number, max: number) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			// Move Nyan cat
			function moveNyan() {
				const tamX = 34 / 2;
				const tamY = 33 / 2;
				px += (posX - px - tamX) / 50;
				py += (posY - py - tamY) / 50;

				nyanStyle = {
					left: px + 'px',
					top: py + 'px'
				};
			}

			// Rainbow trail
			function peidaArcoIris() {
				const qnt = Math.floor(px / 9) + 2;

				if (pilha.length >= qnt) pilha.pop();

				pilha.unshift(py);

				rainbows.forEach((rainbow, i) => {
					if (i < qnt) {
						const am = i % 2;
						(rainbow as HTMLElement).style.top = pilha[i] + (an ? (am ? 0 : 1) : am) + 'px';
						(rainbow as HTMLElement).style.display = 'block';
					} else {
						(rainbow as HTMLElement).style.display = 'none';
					}
				});
			}

			// Animation loops
			setInterval(() => {
				moveNyan();
				peidaArcoIris();
			}, 10);

			setInterval(() => {
				criarEstrela();
			}, 300);

			setInterval(() => {
				an = !an;
			}, 500);
		}
	});
</script>

<svelte:head>
	<title>bStats - Admin Panel</title>
	<meta name="description" content="Psst!" />
	{#if !data.isAdmin}
		<style>
			body {
				background: #0f4d8f;
			}
			.nyan {
				z-index: 10;
				position: absolute;
				width: 34px;
				height: 33px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAAgCAYAAABepJcLAAACiUlEQVR4nO2Yi23DMAxEvVMW6Ghdwzt1p7Qp4sKhKIkUqVyUXtEHBIlsPZ9J+bN9fG4bIcQGXICQlYALELIScAFCVgIuQMhKwAUIWQnboG27RkmRpQc9wB4mievXHiYaCj3o8QoePomffzcJodCDHq/iYRepTXTZ9c+KTEog9KAH0MMm0pvI2MHhQOhBjwSP7f680vM4xo03TIdC5CzeEcn0KFwqHl4XeqxfH7ex+77/0spDjktvGFVE6dyaSPaJqbqIE+Nxocf69XHefysPOeahYQ7RA7PIqTOjIqFAxCW46aKcmLQCocf0+pA1GvU45jmj/V40jNw42rlekVAgk1wyV/aVPeTYjJV9JAtZp1kePdSG0ZpGFak8UEVF3IE0HuwyXMyF+uYecltZ5Mj68HqMOBR5yFVECnU791JeSoe71xOI4pEVSq1I0R6IPGRdIOtDa+BjzIjH7a/mJn8rGqbWNH8ijhVsRMQciOGVYaZLtXEBHsg8ZA6o+sisU20xOB9bt2G0YCz3hhki5kCe4KJtg/AIraiTzo37SjfJIeJxvaM1bNHAd6oNY74FUd48RESGA6m8EQqFUjnBSA/zQjbBY+jlwxPqI8NDZiw/mxvmQaRzucsQyfDIdJEFivCQY5B5vFt91BaiM2r2ZpHOJS8qkuUx0wXhcfyO9mjegQDrw+uhubQosjffDhmIiLhDAbjQQ7/6orI49jeah4VizpaIZTUYxdMsMz1GXJAe6DzO8yOzmOXRa1bzSdG+t2xr3c5aIJ79vaML2gE9P9qjusMz2ve9g6lt6ynQ1pwZLl6fV3BBO6Dnz9hP5BhcxUvIfwcuQMhKwAUIWQm4ACErARcgZCXgAoSsxDdoVHw2ca8RoAAAAABJRU5ErkJggg==);
			}
			.rainbow {
				position: absolute;
				width: 9px;
				height: 18px;
				margin-top: 6px;
				z-index: 5;
				background-image: url(data:image/png;base64,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);
			}
			.star {
				width: 7px;
				height: 7px;
				position: absolute;
				z-index: 1;
				background-size: 100% 100%;
				background-image: url(data:image/gif;base64,R0lGODlhBwAHAIABAP///////yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU0NTY1ODg4RDlBODExRTI5MzZGQjVEN0ZDMUFENjhCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU0NTY1ODg5RDlBODExRTI5MzZGQjVEN0ZDMUFENjhCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTQ1NjU4ODZEOUE4MTFFMjkzNkZCNUQ3RkMxQUQ2OEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTQ1NjU4ODdEOUE4MTFFMjkzNkZCNUQ3RkMxQUQ2OEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQJFAABACwAAAAABwAHAAACB4yPqQfrXwAAIfkEBRQAAQAsAAAAAAcABwAAAgmMj2mQzPiUNAUAIfkECRQAAQAsAQABAAUABQAAAgdMYGm4mlwAACH5BAkUAAEALAAAAAAHAAcAAAILjGEZqA0IWUuSpgIAIfkECRQAAQAsAAAAAAcABwAAAgqMYZeYzdscnKEAACH5BAUUAAEALAAAAAAHAAcAAAIJjGGpm6jO4kkFADs=);
			}
		</style>
	{/if}
</svelte:head>

<div class="container">
	{#if !data.isAdmin}
		<!-- Credits for the Nayan cat codes goes to https://codepen.io/brunorcunha/ -->
		<div class="nyan" style="left: {nyanStyle.left}; top: {nyanStyle.top}"></div>
		<div style="height: 500px"></div>
		<audio loop autoplay>
			<source src="/nyan.mp3" type="audio/mpeg" />
		</audio>
	{:else}
		<br /><br />
		<!-- Admin Panel Content - Password Reset -->
		<h5 class="{data.customColor1}-text col s12 center-align">Generate Password Reset Link</h5>
		<div class="z-depth-1 grey lighten-4 row">
			<form
				class="col s12 container"
				method="POST"
				action="?/generateResetLink"
				style="margin-bottom: 15px"
				use:enhance
			>
				<div class="input-field col s12">
					<input id="username" type="text" name="username" required />
					<label for="username">Username</label>
					<span class="helper-text">Enter the username for password reset</span>
				</div>
				<!-- Submit button -->
				<button
					type="submit"
					class="col s12 l6 offset-l3 btn btn-large waves-effect {data.customColor1}"
				>
					Generate Reset Link
				</button>
			</form>
		</div>

		<!-- Result display -->
		{#if form}
			<div id="result" style="margin-top: 20px;">
				<div class="z-depth-1 grey lighten-4 row">
					<div class="col s12 container" style="padding: 20px;">
						{#if form.success}
							<div id="success-message">
								<h6 class="green-text">Reset Link Generated Successfully!</h6>
								<p><strong>Reset Link:</strong></p>
								<div
									style="background: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; margin: 10px 0;"
								>
									<span>{form.resetLink}</span>
								</div>
								<p><strong>Token:</strong> <code>{form.token}</code></p>
								<p><strong>Expires:</strong> {form.expiresIn}</p>
								<button
									class="btn waves-effect {data.customColor1}"
									onclick={() => copyToClipboard(form.resetLink)}
								>
									Copy Link
								</button>
							</div>
						{:else}
							<div id="error-message">
								<h6 class="red-text">Error</h6>
								<p>{form.error || 'An unknown error occurred'}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
