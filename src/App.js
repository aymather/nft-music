import { useEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5radar from '@amcharts/amcharts5/radar'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import rap from './r&b.json'
// import rap from './rap.json'
import bg from './silk_sonic.jpg'

const colors = [
	'rgb(40, 30, 34)',
	'rgb(189, 155, 119)',
	'rgb(138, 105, 97)',
	'rgb(175, 171, 173)',
	'rgb(206, 210, 215)',
	'rgb(42, 38, 44)',
	'rgb(97, 112, 122)',
	'rgb(198, 184, 163)',
	'rgb(100, 70, 59)',
	'rgb(187, 190, 194)',
	'rgb(169, 165, 167)',
	'rgb(81, 79, 74)'
]

const App = () => {

	const ref = useRef({})

	useEffect(() => {

		let root = am5.Root.new('chartdiv')

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
			am5themes_Animated.new(root)
		])


		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		let chart = root.container.children.push(am5radar.RadarChart.new(root, {
			panX: false,
			panY: false,
			wheelX: 'none',
			wheelY: 'none',
			startAngle: 0,
			endAngle: 360,
			innerRadius: am5.percent(30)
		}))

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		let xRenderer = am5radar.AxisRendererCircular.new(root, {
			minGridDistance: 30,
			forceHidden: true
		})
		xRenderer.grid.template.set('forceHidden', true)

		let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
			maxDeviation: 0,
			categoryField: 'name',
			renderer: xRenderer,
			forceHidden: true
		}))

		let yRenderer = am5radar.AxisRendererRadial.new(root, {
			inversed: true
		})
		yRenderer.grid.template.set('stroke', '#ccc')

		let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			maxDeviation: 0.3,
			min: 0,
			renderer: yRenderer,
			forceHidden: true
		}))

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		let series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
			name: 'Series 1',
			sequencedInterpolation: true,
			xAxis: xAxis,
			yAxis: yAxis,
			valueYField: 'streams_norm',
			categoryXField: 'name'
		}))

		// Rounded corners for columns
		series.columns.template.setAll({
			cornerRadius: 5
		})

		let color = colors[Math.floor(Math.random() * colors.length)]

		let all_colors_1 = []
		let all_colors_2 = []
		for(let i = 0; i < 200; i++) { all_colors_1.push(colors[Math.floor(Math.random() * colors.length)]) }
		for(let i = 0; i < 200; i++) { all_colors_2.push(colors[Math.floor(Math.random() * colors.length)]) }


		// Make each column to be of a different color
		series.columns.template.adapters.add('fill', function (fill, target) {
			// return chart.get('colors').getIndex(series.columns.indexOf(target))
			// return am5.color(0xf0b24f * series.columns.indexOf(target) * 5000)
			// return colors[Math.floor(Math.random() * colors.length)]
			return all_colors_1[series.columns.indexOf(target)]
		})

		series.columns.template.adapters.add('stroke', function (stroke, target) {
			// return chart.get('colors').getIndex(series.columns.indexOf(target))
			// return am5.color(0xf0b24f)
			// return am5.color(0xf0b24f * series.columns.indexOf(target) * 5000)
			// return colors[Math.floor(Math.random() * colors.length)]
			return all_colors_1[series.columns.indexOf(target)]
		})

		xAxis.data.setAll(rap[0])
		series.data.setAll(rap[0])

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		series.appear(1000)
		chart.appear(1000)

		ref.current = series.data

		var idx = 0
		const interval = setInterval(() => {
			
			ref.current.each((item, index) => {
				if(rap[idx] && rap[idx][index]) {
					ref.current.setIndex(index, { ...item, streams_norm: rap[idx][index].streams_norm })
				}
			})

			if(idx == rap.length - 1) {
				idx = 0
			} else {
				idx += 1
			}

		}, 90)

		return () => {
			clearInterval(interval)
			chart.dispose()
		}

	}, [])

	return (
		<div className='container'>
			<div className='img-container-wrap'>
				<div className='img-container'>
					<div className='img-container-tint'></div>
					<img src={bg} alt='bg' className='bg' />
				</div>
			</div>
			<div id='chartdiv' className='vibrate' style={{ height: '500px', width: '100%' }}></div>
			<h1 className='title'>r&b 2021</h1>
		</div>
	)
}

export default App