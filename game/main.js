const imagePaths = ["./images/banana.png", "./images/blueberry.png", "./images/orange.png", "./images/pineapple.png", "./images/avocado.png", "./images/strawberry.png"];



document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('start').addEventListener('click', async function () {
		enableFullscreen();
		document.getElementById('audio').play();
		let imgLimit = parseInt(document.getElementById('imgLimit').value);
		document.getElementById('intro').remove();
		const images = await loadImages();

		let liveImages = [];

		for (var i = 0; i < imgLimit; i++) {
			spawnImage();
		}


		function spawnImage() {
			let image = getRandomImage(images);
			let location = getRandomLocation(image, liveImages)
			let img = image.el;

			img.style.left = location.x + 'px';
			img.style.top = location.y + 'px';
			img.classList.add('sway')

			document.body.appendChild(img);
			img.addEventListener('touchstart', handleInteraction)

			liveImages.push({ ...image, ...location })
		}

		function handleInteraction(e) {
			for (var i = 0; i < liveImages.length; i++) {
				if (liveImages[i].el === e.target) {
					let el = liveImages[i].el;
					el.removeEventListener('touchstart', handleInteraction);
					el.classList.remove('sway');
					el.classList.add('pop');
					createParticles(e.touches[0].clientX, e.touches[0].clientY);
					setTimeout(() => {
						el.remove();
						liveImages.splice(i, 1);
						spawnImage();
					}, 400);

					document.body.classList.remove('flash');
					document.body.classList.add('flash');
					setTimeout(() => {
						document.body.classList.remove('flash');
					}, 150);
				}
			}
		}



		function getRandomLocation(img, liveImages) {
			const imgWidth = img.width;
			const imgHeight = img.height;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			let x, y;

			do {
				x = Math.floor(Math.random() * (windowWidth - imgWidth));
				y = Math.floor(Math.random() * (windowHeight - imgHeight));
			} while (doesOverlap(x, y, imgWidth, imgHeight, liveImages));

			return { x, y };
		}

		// Check if an image overlaps with any other images in liveImages
		function doesOverlap(x, y, width, height, liveImages) {
			for (const image of liveImages) {
				if (
					x < image.x + image.width &&
					x + width > image.x &&
					y < image.y + image.height &&
					y + height > image.y
				) {
					return true; // Overlapping
				}
			}
			return false; // Not overlapping
		}


		function getRandomImage(images) {
			const image = images[Math.floor(Math.random() * images.length)];
			const img = new Image();
			img.src = image.src;
			img.width = image.width
			img.height = image.height
			img.style.position = 'absolute';
			image.el = img;
			return image;
		}

		function createParticles(x, y) {
			const numParticles = 50; // Adjust the number of particles as needed

			for (let i = 0; i < numParticles; i++) {
				const particle = document.createElement('div');
				particle.className = 'particle';
				document.body.appendChild(particle);

				const angle = Math.random() * 2 * Math.PI;
				const speed = Math.random() * 5 + 2;
				const color = getRandomColor();

				particle.style.left = x + 'px';
				particle.style.top = y + 'px';
				particle.style.backgroundColor = color;

				const deltaX = Math.cos(angle) * speed;
				const deltaY = Math.sin(angle) * speed;

				setTimeout(() => {
					particle.style.transform = `translate(${deltaX * 50}px, ${deltaY * 50}px) scale(0)`;
					particle.style.opacity = '0';
				}, 0);

				setTimeout(() => {
					document.body.removeChild(particle);
				}, 500);
			}
		}

		function getRandomColor() {
			const letters = '0123456789ABCDEF';
			let color = '#';
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}
	})

	function enableFullscreen() {
		const element = document.documentElement;

		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) { /* Firefox */
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) { /* IE/Edge */
			element.msRequestFullscreen();
		}
	}
})


const loadImages = async () => {
	const loadImage = (path) => new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = path;
	});

	const imagesArray = [];

	for (const path of imagePaths) {
		const img = await loadImage(path);

		const dummyElement = document.createElement('div');
		dummyElement.appendChild(img);

		document.body.appendChild(dummyElement);

		const styles = window.getComputedStyle(img);
		const width = parseFloat(styles.getPropertyValue("width"));
		const height = parseFloat(styles.getPropertyValue("height"));

		document.body.removeChild(dummyElement);

		const imageInfo = {
			src: path,
			width: width,
			height: height
		};

		imagesArray.push(imageInfo);
	}

	return imagesArray;
};

