const imagePaths = ["./images/banana.png", "./images/blueberry.png", "./images/orange.png", "./images/pineapple.png", "./images/avocado.png", "./images/strawberry.png"];



document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('start').addEventListener('click', async function () {
		enableFullscreen();
		document.getElementById('audio').play();
		let imgLimit = parseInt(document.getElementById('imgLimit').value);
		let imgSize = parseInt(document.getElementById('imgSize').value);
		document.head.innerHTML += `<style>img{max-width: ${imgSize}vw; max-height: ${imgSize}vh;}</style>;`
		document.getElementById('intro').remove();
		const images = await loadImages();
		console.log(images)

		let liveImages = [];

		for (var i = 0; i < imgLimit; i++) {
			spawnImage();
		}


		function spawnImage() {
			// console.log("spawning_image");
			let image = getRandomImage(images);
			// console.log("img->", image);
			let location = getRandomLocation(image, liveImages)

			if(!location) {
				return false;
			}
			// console.log("location->", location);
			let img = image.el;

			img.style.left = location.x + 'px';
			img.style.top = location.y + 'px';
			img.classList.add('sway')

			document.body.appendChild(img);
			img.addEventListener('touchstart', handleInteraction)
			// img.addEventListener('touchend', handleInteraction)

			liveImages.push({ ...image, ...location })
		}

		function handleInteraction(e) {
			console.log("TARGET", e.target);

			liveImages.forEach((image, index) => {
				if (image.el === e.target) {
					console.log("match", index, image);
					image.el.removeEventListener('touchstart', handleInteraction);
					image.el.classList.remove('sway');
					image.el.classList.add('pop');

					console.log("TOUCHES",e.touches);
					createParticles(e.touches[0].clientX, e.touches[0].clientY);

					setTimeout(() => {
						image.el.remove()
						liveImages.splice(index, 1);
						spawnImage();
					}, 400);

					document.body.classList.remove('flash');
					document.body.classList.add('flash');
					setTimeout(() => {
						document.body.classList.remove('flash');
					}, 150);

					return;
				}
			})

		}



		function getRandomLocation(img, liveImages) {
			// console.log("getting location", img, liveImages);
			const imgWidth = img.width;
			const imgHeight = img.height;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			let x, y;
			let chk = 0;

			do {
				chk++;
				x = Math.floor(Math.random() * (windowWidth - imgWidth));
				y = Math.floor(Math.random() * (windowHeight - imgHeight));
				if (chk === 40) {
					return false;
				}
			} while (doesOverlap(x, y, imgWidth, imgHeight, liveImages));

			return { x, y };
		}

		// Check if an image overlaps with any other images in liveImages
		function doesOverlap(x, y, width, height, liveImages) {
			console.log("overlap check");
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
			// console.log("creating particles");
			const numParticles = 50; // Adjust the number of particles as needed

			for (let i = 0; i < numParticles; i++) {
				// console.log("CREATING PARTICLE " + i)
				const particle = document.createElement('div');
				particle.className = 'particle';
				document.body.appendChild(particle);

				const angle = Math.random() * 2 * Math.PI;
				const speed = Math.random() * 5 + 2;
				const color = getRandomColor();
				// console.log(angle,speed,color);

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
					// console.log("REMOVING PARTICLE " + i)
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
