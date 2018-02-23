
## Free range slider

![chSlider preview](lib/img/chSlider.jpg)

- [x] IE8+
- [x] Support touches
- [x] Responsive design

### Usage

include chSlider.js file to your page (if you need ie8 suppor, you will need also include polyfill and put ./PIE.htc)

```
	<!DOCTYPE html>
	<html lang="en">
		<head>
			...
		</head>
		<body>
			...
			<div id="mySlider" class="slider">
				<div class="thumb"></div>
			</div>
			...

			<!-- polyfill for ie8 -->
			<script src="//cdn.polyfill.io/v1/polyfill.js?features=es6"></script>
			<script src="chSlider.js"></script>

			<script>
				var slider = new chSlider({ sliderId: 'mySlider' });

				var xhr = new XMLHttpRequest();

				var json = JSON.stringify({
				  value: slider.getValue()
				});

				xhr.open("POST", '/submit', true)
				xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

				xhr.onreadystatechange = ...;

				xhr.send(json);
			</script>
		</body>
	</html>
```

### Demos and Sample Usage

For Demos clone this directory

```
	git clone git@github.com:Chelowe4ok/chSlider.git
```
and launch index.html in your browser

### Options

```javascript
var options = {

            width: '300px',
			height: '0.2em',
			sliderId: 'slider',
			sliderColor: '#E0E0E0',
			fillColor: '#617ba2',
			thumbClass: 'thumb', thumbRadius: '25px',
			thumbColor: "#617ba2",
			thumbHoverColor: "#617ba2",
			startRange: 0,
			endRange: 100,
			step: 1,
			value: 0,
			displayValue: true,
			onchange: function (value) { }
} 

var mySlider = new chSlider(options);
```
### Methods

```javascript
	slider.getValue() - return current value;
	slider.setValue(value) - set current value;
	slider.getCurrentConfig() - return current configuration of a slider
	slider.getUIElements() - return object with references to HTML elements (slider, thumb, filling, display)
```