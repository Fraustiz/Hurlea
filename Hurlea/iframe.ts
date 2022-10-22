const iframe = new iFrame();
iframe.on("UpdateData", async () => {
	const video = document.querySelector<HTMLVideoElement>("#player_html5_api");
	if (video && !isNaN(video.duration)) {
		iframe.send({
			video: true,
			duration: video.duration,
			currentTime: video.currentTime,
			paused: video.paused,
		});
	} else {
		iframe.send({
			video: false,
		});
	}
});