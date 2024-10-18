const webcam = document.querySelector('#webcam');
const btnValidate = document.querySelector('#btn-validate');
const btnPhoto = document.querySelector('#btn-photo');
const btnSave = document.querySelector('#btn-save');
const containerPhoto = document.querySelector('#contentPhoto');
const select = document.querySelector('#webcam');
const video = document.querySelector('video');
let currentStream;
let capturedImage;

navigator.mediaDevices.getUserMedia({ video: true })
	.then(() => {
		return navigator.mediaDevices.enumerateDevices();
	})
	.then((devices) => {
		devices.forEach((device) => {
			if (device.kind === 'videoinput') {
				const option = document.createElement('option');
				option.value = device.deviceId;
				option.innerText = device.label || `Caméra ${select.length + 1}`;
				select.appendChild(option);
			}
		});
	})
	.catch((err) => {
		console.error(`Erreur : ${err.name} - ${err.message}`);
	});

btnValidate.addEventListener('click', () => {
	const selectedDeviceId = select.value;

	if (selectedDeviceId) {
		navigator.mediaDevices.getUserMedia({
			audio: false,
			video: { deviceId: { exact: selectedDeviceId } }
		})
			.then((stream) => {
				currentStream = stream;
				video.srcObject = stream;
				
				video.play();
			})
			.catch((err) => {
				console.error(`Erreur : ${err.name} - ${err.message}`);
			});
	} else {
		alert("Aucune caméra sélectionnée.");
	}
});

btnPhoto.addEventListener('click', () => {
	if (!currentStream) {
		console.error('pas de vidéo en cours');
		return;
	}

	const track = currentStream.getVideoTracks()[0];
	const imageCapture = new ImageCapture(track);

	imageCapture.takePhoto()
		.then((blob) => {
			const imgUrl = URL.createObjectURL(blob);
			capturedImage = imgUrl;

			const capturedImageElement = document.createElement('img');
			capturedImageElement.src = capturedImage;
			capturedImageElement.classList.add('no-color')
			containerPhoto.innerHTML = '';
			containerPhoto.appendChild(capturedImageElement);
		})
		.catch((error) => console.error(error.message));
});

btnSave.addEventListener('click', () => {
	if (capturedImage) {
		const link = document.createElement('a');
		link.href = capturedImage;
		link.download = 'capture.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link); 
	}
});