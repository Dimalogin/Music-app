import appTemplate from "../templates/appTemplate";
import getAudioFromApi from "./utils/getAudioFromApi";
import ViewNewTrackObject from "../interfaces/ViewNewTrackObject";
import trackItemTemplate from "../templates/trackItemTemplate";
import formatTime from "./utils/formatTIme";
import nothingFoundTemplate from "../templates/nothingFoundTemplate";
import erroMessageTemplate from "../templates/errorMessageTemplate";

class App {
  readonly #eventListeners = {
    handleEvent: (event: Event) => {
      switch (event.currentTarget) {
        case this.#form:
          this.#getDataFromApi(event);
          break;

        case this.#tracksList:
          const targetList = event.target as HTMLElement;

          if (targetList.closest(".artist-trigger")) {
            const track: HTMLElement | null =
              targetList.closest(".list-track")!;
            this.#launchTrack(track);
          }

          break;

        case this.#audioplayer:
          const targetAudioplayer = event.target as HTMLElement;
          if (this.#barAudio?.src !== "" && this.#arrayTracks.length > 0) {
            if (targetAudioplayer.closest(".trigger-btn")) {
              this.#onTriggerAudioplayer();
            }

            if (targetAudioplayer.closest(".audioplayer-progress")) {
              this.#updateProgressByClick(event);
            }

            if (targetAudioplayer.closest(".prev-btn")) {
              this.#previousTrack();
            }

            if (targetAudioplayer.closest(".next-btn")) {
              this.#nextTrack();
            }
          }

          break;
      }
    },
  };

  #form: HTMLFormElement | null = null;
  #audioplayer: HTMLDivElement | null = null;
  #tracksList: HTMLUListElement | null = null;

  #audioProgress: HTMLDivElement | null = null;
  #progressBar: HTMLElement | null = null;
  #barAudio: HTMLAudioElement | null = null;

  #tracksMain: HTMLDivElement | null = null;
  #loader: HTMLDivElement | null = null;

  #arrayTracks: ViewNewTrackObject[] = [];

  render() {
    this.#initAppTemplate();
    this.#bindListeners();
  }

  #initAppTemplate() {
    const body = document.body;
    const fullViewApp = appTemplate.content.cloneNode(true) as DocumentFragment;

    this.#form = fullViewApp.querySelector(".form-search");
    this.#audioplayer = fullViewApp.querySelector(".audioplayer");
    this.#tracksMain = fullViewApp.querySelector(".tracks");
    this.#tracksList = fullViewApp.querySelector(".list-tracks");
    this.#barAudio = fullViewApp.querySelector("#bar-audio");
    this.#audioProgress = fullViewApp.querySelector(".audioplayer-progress");
    this.#progressBar = fullViewApp.querySelector(".progress-bar");
    this.#loader = fullViewApp.querySelector(".tracks-loader");

    body.innerHTML = "";
    body.appendChild(fullViewApp);
  }

  #bindListeners(): void {
    this.#form?.addEventListener("submit", this.#eventListeners);
    this.#tracksList?.addEventListener("click", this.#eventListeners);
    this.#audioplayer?.addEventListener("click", this.#eventListeners);
    this.#audioProgress?.addEventListener("click", this.#eventListeners);

    this.#barAudio?.addEventListener(
      "timeupdate",
      this.#updateAudioplayerProgressBar.bind(this)
    );
    this.#barAudio?.addEventListener(
      "timeupdate",
      this.#updateAudioplayerTime.bind(this)
    );
    this.#barAudio?.addEventListener(
      "ended",
      this.#switchTrackOnCompletion.bind(this)
    );
  }

  #getDataFromApi(event: Event): void {
    event.preventDefault();

    this.#tracksList!.innerHTML = "";
    this.#showLoader();

    const form = new FormData(this.#form!);
    const value = form.get("titleTrack") as string;

    setTimeout(() => {
      getAudioFromApi(value.trim())
        .then((result) => {
          if (result.error) {
            this.#arrayTracks = [];
            this.#initSearchingResults(value, 0);
            this.#renderErrorMessage(result.error.message);
            this.#hideLoader();
          } else if (result.data) {
            const quantity = result.data.length;
            if (quantity > 0) {
              const data = result.data.map((item) => {
                return {
                  isPlay: false,
                  ...item,
                };
              });

              this.#arrayTracks = [...data];
              this.#initSearchingResults(value, quantity);
              this.#renderTracks(data);
              this.#hideLoader();
            } else {
              this.#arrayTracks = [];
              this.#initSearchingResults(value, 0);
              this.#renderNothingFound();
              this.#hideLoader();
            }
          }
        })
        .catch((error) => {
          this.#arrayTracks = [];
          this.#initSearchingResults(value, 0);
          this.#renderErrorMessage(error);
          this.#hideLoader();
        });
    }, 500);

    this.#form?.reset();
  }

  #initSearchingResults(value: string, result: number): void {
    const resultSearch = this.#tracksMain?.querySelector(
      ".results-search__text"
    ) as HTMLElement;
    const resultCount = this.#tracksMain?.querySelector(
      ".results-count__text"
    ) as HTMLElement;

    resultSearch.innerHTML = value;
    resultCount.innerHTML = String(result);
  }

  #renderTracks(data: ViewNewTrackObject[]) {
    this.#tracksList!.innerHTML = "";

    this.#tracksList!.appendChild(
      data.reduce((fragment, item) => {
        const element = trackItemTemplate.content.cloneNode(
          true
        ) as DocumentFragment;

        const track: HTMLElement | null = element.querySelector(".list-track")!;
        const artistIcon: HTMLImageElement | null =
          element.querySelector(".artist__icon")!;
        const titleArtist: HTMLElement | null =
          element.querySelector(".title__artist")!;
        const titleTrack: HTMLElement | null =
          element.querySelector(".title__track")!;
        const trackTime: HTMLElement | null =
          element.querySelector(".track-time")!;
        const triggerIcon: HTMLImageElement | null =
          element.querySelector(".trigger__icon")!;

        track.dataset.idTrack = String(item.id);
        track.dataset.trackSrc = item.preview;
        track.dataset.isPlay = String(item.isPlay);
        track.classList.toggle("track-active", item.isPlay);
        artistIcon.dataset.artistIcon = item.album.cover_big;
        artistIcon.src = item.album.cover_big;
        titleArtist.dataset.titleArtist = item.artist.name;
        titleArtist.innerHTML = item.artist.name;
        titleTrack.dataset.titleTrack = item.title_short;
        titleTrack.innerHTML = item.title_short;

        const duration = formatTime(item.duration);
        trackTime.innerHTML = duration;

        item.isPlay
          ? (triggerIcon.src = "./images/pause.png")
          : (triggerIcon.src = "./images/play.png");
        fragment.appendChild(element);
        return fragment;
      }, document.createDocumentFragment())
    );
  }

  #renderErrorMessage(message: string): void {
    const fullView = erroMessageTemplate.content.cloneNode(
      true
    ) as DocumentFragment;
    const text: HTMLElement | null = fullView.querySelector(
      ".error-message__text"
    );

    text!.innerHTML = message;

    this.#tracksList!.innerHTML = "";
    this.#tracksList!.appendChild(fullView);
  }

  #renderNothingFound(): void {
    const fullView = nothingFoundTemplate.content.cloneNode(
      true
    ) as DocumentFragment;

    this.#tracksList!.innerHTML = "";
    this.#tracksList!.appendChild(fullView);
  }

  #launchTrack(element: HTMLElement): void {
    const trackId = element.dataset.idTrack!;
    const trackSrc = element.dataset.trackSrc!;
    const trackIsPlay = element.dataset.isPlay;

    const artistIcon: HTMLElement | null =
      element.querySelector(".artist__icon")!;
    const titleArtist: HTMLElement | null =
      element.querySelector(".title__artist")!;
    const titleTrack: HTMLElement | null =
      element.querySelector(".title__track")!;
    const triggerIconTrack: HTMLImageElement | null =
      element.querySelector(".trigger__icon")!;

    const artistIconSrc = artistIcon.dataset.artistIcon!;
    const titleArtistName = titleArtist.dataset.titleArtist!;
    const titleTrackName = titleTrack.dataset.titleTrack!;

    const dataTrack: Array<string> = [
      trackSrc,
      artistIconSrc,
      titleArtistName,
      titleTrackName,
    ];

    this.#audioplayer!.dataset.idTrack = trackId;

    const triggerBtnAudioplayer = this.#audioplayer?.querySelector(
      ".trigger-btn"
    ) as HTMLElement;
    const triggerBtnIconAudioplayer = this.#audioplayer?.querySelector(
      ".trigger-btn__icon"
    ) as HTMLImageElement;

    if (this.#barAudio?.src === trackSrc) {
      if (trackIsPlay === "true") {
        element.dataset.isPlay = "false";
        triggerIconTrack.src = "./images/play.png";

        triggerBtnAudioplayer.dataset.onTrigger = "false";
        triggerBtnIconAudioplayer.src = "./images/play.png";
        this.#pauseMusic();
      }

      if (trackIsPlay === "false") {
        element.dataset.isPlay = "true";
        triggerIconTrack.src = "./images/pause.png";

        triggerBtnAudioplayer.dataset.onTrigger = "true";
        triggerBtnIconAudioplayer.src = "./images/pause.png";
        this.#playMusic();
      }
    } else {
      triggerIconTrack.src = "./images/pause.png";
      triggerBtnAudioplayer.dataset.onTrigger = "true";
      triggerBtnIconAudioplayer.src = "./images/pause.png";

      this.#loadingTrack(dataTrack);
      this.#updateTrackList(trackId);
    }
  }

  #updateTrackList(trackId: string): void {
    this.#arrayTracks = this.#arrayTracks.map((track) => {
      return track.id === Number(trackId)
        ? { ...track, isPlay: true }
        : { ...track, isPlay: false };
    });

    this.#renderTracks(this.#arrayTracks);
  }

  #loadingTrack(data: Array<string>): void {
    const [trackSrc, artistIconSrc, titleArtistName, titleTrackName] = data;

    const audioplayerImage: HTMLElement | null =
      this.#audioplayer?.querySelector(".audioplayer-image")!;
    const audioplayerIcon: HTMLImageElement | null =
      this.#audioplayer?.querySelector(".image__album")!;
    const audioplayerTitleArtist: HTMLElement | null =
      this.#audioplayer?.querySelector(".details-title__artist")!;
    const audioplayerTitleTrack: HTMLElement | null =
      this.#audioplayer?.querySelector(".details-title__track")!;

    audioplayerImage.style.padding = "0px";
    audioplayerIcon.src = artistIconSrc;
    audioplayerTitleArtist.innerHTML = titleArtistName;
    audioplayerTitleTrack.innerHTML = titleTrackName;

    this.#barAudio!.src = trackSrc;
    this.#playMusic();
  }

  #onTriggerAudioplayer(): void {
    const trackId = this.#audioplayer?.dataset.idTrack!;
    const audioplayerTriggerBtn: HTMLElement | null =
      this.#audioplayer?.querySelector(".trigger-btn")!;
    const audioplayerTriggerBtnIcon: HTMLImageElement | null =
      this.#audioplayer?.querySelector(".trigger-btn__icon")!;

    const audioplayerIsPlay = audioplayerTriggerBtn.dataset.onTrigger;
    const indexCurrentTrack = this.#getIndexCurrentTrack(trackId);
    const allTracks: NodeList | null =
      this.#tracksList?.querySelectorAll(".list-track")!;

    if (indexCurrentTrack !== -1) {
      const currentTrack = Array.from(allTracks)[
        indexCurrentTrack
      ] as HTMLElement;

      const triggerIconTrack: HTMLImageElement | null =
        currentTrack.querySelector(".trigger__icon")!;

      if (audioplayerIsPlay === "false") {
        audioplayerTriggerBtn.dataset.onTrigger = "true";

        audioplayerTriggerBtnIcon.src = "./images/pause.png";
        triggerIconTrack.src = "./images/pause.png";
        this.#playMusic();
      }

      if (audioplayerIsPlay === "true") {
        audioplayerTriggerBtn.dataset.onTrigger = "false";

        audioplayerTriggerBtnIcon.src = "./images/play.png";
        triggerIconTrack.src = "./images/play.png";
        this.#pauseMusic();
      }
    }
  }

  #getIndexCurrentTrack(trackId: string): number {
    return this.#arrayTracks.findIndex((item) => {
      if (item.id === Number(trackId)) {
        return item;
      }
    });
  }

  #playMusic(): void {
    this.#barAudio?.play();
  }

  #pauseMusic(): void {
    this.#barAudio?.pause();
  }

  #updateAudioplayerProgressBar(event: Event): void {
    const target = event.target as HTMLAudioElement;
    const currentTime = target.currentTime;
    const duration = target.duration;
    let progressWidth = (currentTime / duration) * 100;
    this.#progressBar!.style.width = `${progressWidth}%`;

    const musicCurrentTime: HTMLElement | null =
      this.#audioplayer?.querySelector(".progress__start-time")!;

    musicCurrentTime.innerHTML = formatTime(Math.floor(currentTime));
  }

  #updateAudioplayerTime(event: Event): void {
    const target = event.target as HTMLAudioElement;
    const mainDuration = target.duration;

    const musicDuartion: HTMLElement | null = this.#audioplayer?.querySelector(
      ".progress__finish-time"
    )!;

    musicDuartion.innerHTML = formatTime(Math.floor(mainDuration));
  }

  #switchTrackOnCompletion(): void {
    const trackId = this.#audioplayer?.dataset.idTrack!;
    const indexCurrentTrack = this.#getIndexCurrentTrack(trackId);
    const allTracks: NodeList | null =
      this.#tracksList?.querySelectorAll(".list-track")!;

    if (allTracks.length > 0) {
      const lastTrack = allTracks.length - 1;
      let nextTrack;

      if (indexCurrentTrack === lastTrack) {
        nextTrack = allTracks[0] as HTMLElement;
      } else {
        nextTrack = allTracks[indexCurrentTrack + 1] as HTMLElement;
      }

      const artistTrigger: HTMLElement | null =
        nextTrack?.querySelector(".artist-trigger")!;

      setTimeout(() => {
        artistTrigger.click();
      }, 500);
    }
  }

  #updateProgressByClick(event: Event): void {
    const target = event.target as HTMLElement;
    const mouse = event as MouseEvent;

    let progressWidth = target.clientWidth;
    let clickedOffsetX = mouse.offsetX;
    let songDuration = this.#barAudio?.duration!;

    this.#barAudio!.currentTime =
      (clickedOffsetX / progressWidth) * songDuration;
  }

  #previousTrack(): void {
    const trackId = this.#audioplayer?.dataset.idTrack!;
    const indexCurrentTrack = this.#getIndexCurrentTrack(trackId);
    const allTracks: NodeList | null =
      this.#tracksList?.querySelectorAll(".list-track")!;

    let previousTrack;

    if (indexCurrentTrack !== -1) {
      const lastTracks = allTracks.length - 1;

      if (indexCurrentTrack === 0) {
        previousTrack = allTracks[lastTracks] as HTMLElement;
      } else {
        previousTrack = allTracks[indexCurrentTrack - 1] as HTMLElement;
      }

      const artistTrigger: HTMLElement | null =
        previousTrack?.querySelector(".artist-trigger")!;
      artistTrigger.click();
    }
  }

  #nextTrack(): void {
    const trackId = this.#audioplayer?.dataset.idTrack!;
    const indexCurrentTrack = this.#getIndexCurrentTrack(trackId);
    const allTracks: NodeList | null =
      this.#tracksList?.querySelectorAll(".list-track")!;

    let nextTrack;

    if (indexCurrentTrack !== -1) {
      const lastTracks = allTracks.length - 1;

      if (indexCurrentTrack === lastTracks) {
        nextTrack = allTracks[0] as HTMLElement;
      } else {
        nextTrack = allTracks[indexCurrentTrack + 1] as HTMLElement;
      }

      const artistTrigger: HTMLElement | null =
        nextTrack?.querySelector(".artist-trigger")!;
      artistTrigger.click();
    }
  }

  #showLoader(): void {
    this.#loader!.style.display = "block";
  }

  #hideLoader(): void {
    this.#loader!.style.display = "none";
  }
}

export default App;
