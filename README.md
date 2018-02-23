
## Free range slider

![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)

- [x] IE8+
- [x] Support touches
- [x] Responsive design

### Usage

include chSlider.js file to your page (if you need ie8 suppor, you will need also include polyfill and put ./PIE.htc)

```
	<!DOCTYPE html>
	<html lang="en">
		<head>

			<!-- your code -->

		</head>
		<body>
			<!-- your code -->

			<div id="mySlider" class="slider">
				<div class="thumb"></div>
			</div>

			<!-- also your code -->

			<!-- polyfill for ie8 -->
			<script src="//cdn.polyfill.io/v1/polyfill.js?features=es6"></script>
			<script src="chSlider.js"></script>

			<script>
				var slider = new chSlider({ sliderId: 'mySlider' });
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


