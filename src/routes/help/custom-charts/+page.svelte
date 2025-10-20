<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let gistStylesheetLoaded = $state(false);

	// Function to load a gist via JSONP
	function loadGist(gistId: string, selector: string) {
		const callbackName = `gist_callback_${gistId.replace(/[^a-z0-9]/gi, '')}`;

		// Create global callback
		(window as any)[callbackName] = function(gistData: any) {
			// Load the stylesheet if not already loaded
			if (!gistStylesheetLoaded && gistData.stylesheet) {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = gistData.stylesheet;
				document.head.appendChild(link);
				gistStylesheetLoaded = true;
			}

			// Insert the HTML content
			const container = document.querySelector(selector) as HTMLElement;
			if (container) {
				container.innerHTML = gistData.div;
			}

			// Cleanup
			delete (window as any)[callbackName];
		};

		// Load script with JSONP callback
		const script = document.createElement('script');
		script.src = `https://gist.github.com/Bastian/${gistId}.json?callback=${callbackName}`;
		document.head.appendChild(script);
	}

	onMount(() => {
		// Load GitHub Gists via JSON API
		const gists = [
			{ id: '6ed19dae0322881af4f3dab87075397f', selector: '#gist-simple-pie' },
			{ id: 'b47279b4ff792153480b50ad0945c963', selector: '#gist-advanced-pie' },
			{ id: 'b35de0cfe951f2d7cacabf65762bfb3d', selector: '#gist-drilldown-pie' },
			{ id: 'ea8804db0479c539153f53f1561cc7d3', selector: '#gist-single-line' },
			{ id: '4445ea82bc921dfef82de90b535deb3e', selector: '#gist-multi-line' },
			{ id: '474cf7eb3c2997d3cab73e560dce0caa', selector: '#gist-bar-chart' }
		];

		gists.forEach(({ id, selector }) => {
			loadGist(id, selector);
		});

		// Define global functions required by charts.js
		// Plugin ID '1' is a demo plugin that has example charts
		// TODO This is pretty ugly. Refactor it!
		(window as any).getPluginId = function() {
			return '1';
		};
		(window as any).updatePlayersBadge = function(data: any) {
			// Empty function for demo page
		};
		(window as any).updateServersBadge = function(data: any) {
			// Empty function for demo page
		};

		// Load Highcharts scripts dynamically in sequential order
		if (typeof window !== 'undefined') {
			const scripts = [
				'https://code.highcharts.com/stock/6.0.1/highstock.js',
				'https://code.highcharts.com/maps/6.0.1/modules/map.js',
				'https://code.highcharts.com/6.0.1/modules/exporting.js',
				'https://code.highcharts.com/6.0.1/modules/no-data-to-display.js',
				'/javascripts/charts/themes/chartTheme.js',
				'/javascripts/charts/charts.js'
			];

			// Load scripts sequentially to ensure proper dependency order
			function loadScriptSequentially(index: number) {
				if (index >= scripts.length) {
					initializeCharts();
					return;
				}

				const script = document.createElement('script');
				script.src = scripts[index];
				script.onload = () => {
					loadScriptSequentially(index + 1);
				};
				script.onerror = () => {
					console.error(`Failed to load script: ${scripts[index]}`);
					loadScriptSequentially(index + 1);
				};
				document.body.appendChild(script);
			}

			loadScriptSequentially(0);
		}
	});

	function initializeCharts() {
		if (typeof window.Highcharts !== 'undefined') {
			// Initialize the example bar chart
			const data = {
				valueName: 'Servers',
				categories: ['Feature 1', 'Feature 2'],
				series: [
					{
						name: 'disabled',
						data: [1337, 226]
					},
					{
						name: 'enabled',
						data: [123, 1234]
					}
				]
			};

			window.$('#exampleBar').highcharts({
				chart: {
					type: 'bar',
					renderTo: 'container',
					marginTop: 40,
					marginBottom: 80,
					height: data.categories.length * data.series.length * (30 + data.series.length * 15) + 120
				},
				title: {
					text:
						'<a href="#example" style="text-decoration: none; color: inherit;">Example Bar Chart</a>'
				},
				plotOptions: {
					bar: {
						dataLabels: {
							enabled: true
						}
					},
					series: {
						pointWidth: 25
					}
				},
				tooltip: {
					headerFormat: '<span style="font-size: 18px"><u><b>{point.key}</b></u></span><br/>',
					pointFormat: '<b>Total</b>: {point.y} ' + data.valueName
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -40,
					y: 80,
					floating: true,
					borderWidth: 1,
					backgroundColor:
						(window.Highcharts.theme && window.Highcharts.theme.legendBackgroundColor) ||
						'#FFFFFF',
					shadow: true
				},
				exporting: {
					enabled: false
				},
				yAxis: {
					min: 0,
					title: {
						text: data.valueName,
						align: 'high'
					},
					labels: {
						overflow: 'justify'
					}
				},
				xAxis: {
					categories: data.categories
				},
				series: data.series
			});

			// Wrap Highcharts to remove background
			window.Highcharts.wrap(window.Highcharts.Chart.prototype, 'getContainer', function (
				proceed
			) {
				proceed.call(this);
				this.container.style.background = '';
			});
		}
	}
</script>

<svelte:head>
	<title>bStats - Custom Charts</title>
	<meta name="description" content="Examples for custom charts." />
</svelte:head>

<div class="container">
	<br />
	<div class="col s12">
		<div class="card">
			<div class="card-content">
				<h3 class="center {data.customColor1}-text">Basics</h3>
				Adding charts to your plugin consists of two parts:<br />
				<ul class="browser-default" style="padding-left: 25px">
					<li>Adding charts to your code</li>
					<li>Adding charts on the website</li>
				</ul>
				To add a chart on the website, login and click on the Edit-button on your plugin page:
				<br />
				<img
					src="https://i.imgur.com/dhUF0zc.png"
					style="border:1px solid gray;width:100%;height:100%;max-width:373px;max-height:135px"
					alt="Edit button"
				/>
				<br />
				and add your chart:
				<br />
				<img
					src="https://i.imgur.com/DKbsXZ9.png"
					style="border:1px solid gray;width:100%;height:100%;max-width:1183px;max-height:497px"
					alt="Add chart"
				/>
				<br />
				Pretty easy, isn't it?
			</div>
		</div>
	</div>
	<div class="col s12">
		<div class="card">
			<div class="card-content">
				<h3 class="center {data.customColor1}-text">Pies</h3>
				<div class="row">
					<div id="onlineMode" class="col s12">
						<div
							id="onlineModePie"
							style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"
						></div>
					</div>
				</div>
				A <b>Simple Pie</b> is the most basic chart type. It's a great option for config settings
				as it only accepts one value per server. Adding the chart to your code is fairly easy:
				<div id="gist-simple-pie"></div>
				If you need a pie with more options there's the <b>Advanced Pie</b> which allows you to send
				more than one value. You can also give the values different 'weights'. There are very few cases
				in which you need this type of pie, so I'm sorry for this bad example:
				<div id="gist-advanced-pie"></div>
			</div>
		</div>
	</div>
	<div class="col s12">
		<div class="card">
			<div class="card-content">
				<h3 class="center {data.customColor1}-text">Drilldown Pies</h3>
				<div class="row">
					<div id="os" class="col s12">
						<div
							id="osPie"
							style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"
						></div>
					</div>
				</div>
				A <b>Drilldown Pie</b> is the most fancy pie chart. It's a great choice for displaying complex
				data which would look like a mess, if a normal pie would be used. Creating one is sadly a little
				bit ugly, because of it's complexity:
				<div id="gist-drilldown-pie"></div>
			</div>
		</div>
	</div>
	<div class="col s12">
		<div class="card">
			<div class="card-content">
				<h3 class="center {data.customColor1}-text">Line Charts</h3>
				<div class="row">
					<div id="players">
						<div
							id="playersLineChart"
							style="min-width: 310px; height: 400px; margin: 0 auto"
						></div>
					</div>
				</div>
				A <b>Single Line Chart</b> is exactly what the name says: A line chart with only one line.
				An example for this type of chart is the servers or players chart every plugin has. Implementing
				a Single Line Chart is as simple as implementing a Simple Pie chart:
				<div id="gist-single-line"></div>
				Now it's your turn. What do you think is a <b>Multi Line Chart</b>? Right! A line chart with
				multiple lines:
				<div id="gist-multi-line"></div>
				(Note: Multi Line Charts are still in development)
			</div>
		</div>
	</div>
	<div class="col s12">
		<div class="card">
			<div class="card-content">
				<h3 class="center {data.customColor1}-text">Bar charts</h3>
				<div class="row">
					<div id="example" class="col s12">
						<div id="exampleBar" style="min-width: 310px; margin: 0 auto"></div>
					</div>
				</div>
				<p>
					A <b>Simple Bar Chart</b> represents a bar chart, where each category only has 1 bar. The
					first value of the map is the category name and the second value of the map is the value
					of the bar (most of the time you want it to be 1).
				</p>
				<p>
					An <b>Advanced Bar Chart</b> represents a bar chart, where each category can have multiple
					bars (defined at the creation). The first value of the map is the category name and the second
					value of the map are the values for the bars. The example you can see above is an advanced
					pie chart.
				</p>
				<div id="gist-bar-chart"></div>
			</div>
		</div>
	</div>
</div>
