const presence = new Presence({
		clientId: "1029450072829734962",
});
let browsingTimestamp = Math.floor(Date.now() / 1000),
	iframeDur = 0,
	iframeCur = 0,
	iframePau = false,
	logo = "https://i.imgur.com/HNP2V4l.png",
	play = "https://i.imgur.com/oMQ0rcy.png",
	pause = "https://i.imgur.com/f2ZJkCS.png";	

presence.on(
	"iFrameData",
	(data: {
		video: boolean;
		duration: number;
		currentTime: number;
		paused: boolean;
	}) => {
		if (data.video) {
			iframeDur = data.duration;
			iframeCur = data.currentTime;
			iframePau = data.paused;
		}
	}
);

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const saison = urlParams.get('saison')
const episode = urlParams.get('episode')
const serie = urlParams.get('serie')
const film = urlParams.get('film')
const anime = urlParams.get('anime')

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: logo,
			startTimestamp: browsingTimestamp,
		},
		{ pathname, href } = document.location;

	if (pathname.startsWith("/hurlea_lecture.php")) {

		var titlefull = document.getElementsByTagName("title")[0].innerHTML;
		const title = titlefull.split('/').pop();

		presenceData.details = title;
		delete presenceData.startTimestamp;
		delete presenceData.endTimestamp;
		[, presenceData.endTimestamp] = presence.getTimestamps(
			Math.floor(iframeCur),
			Math.floor(iframeDur)
		);

		if (iframeCur == iframeDur) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		} else {

			if (iframePau === true) {
				presenceData.smallImageKey = pause;
				presenceData.smallImageText = "Pause";
				delete presenceData.startTimestamp;
				delete presenceData.endTimestamp;
			} else if (iframePau === false) {
				presenceData.smallImageKey = play;
				presenceData.smallImageText = "Play";
			}

		}

		if  (serie || anime != null) {
			presenceData.buttons = [
				{
					label: "Voir l'épisode",
					url: href,
				},
			];
		} else if (film != null) {
			presenceData.buttons = [
				{
					label: "Voir le film",
					url: href,
				},
			];
		}

		if (saison && episode != null) {
			presenceData.state = 'Saison ' + saison + ' | Épisode ' + episode;
		}

	} else if (pathname.startsWith("/hurlea_choix_saison.php")) {

		presenceData.details = "Choisit une saison";

	} else if (pathname.startsWith("/hurlea_choix_ep.php")) {

		if (saison != null) {
			presenceData.details = "Choisit un épisode";
			presenceData.state = 'Saison ' + saison;
		}

	} else presenceData.details = "Explore le site";

	presence.setActivity(presenceData);
});
