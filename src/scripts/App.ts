import appTemplate from "../templates/appTemplate";
import getAudioFromApi from "./utils/getAudioFromApi";
import ViewNewTrackObject from "../interfaces/ViewNewTrackObject";
import trackItemTemplate from "../templates/trackItemTemplate";
import formatTime from "./utils/formatTIme";

class App {
  readonly #eventListeners = {
    handleEvent: (event: Event) => {
      switch (event.currentTarget) {
        case this.#form:
          this.#getDataFromApi(event);
          break;
      }
    },
  };

  #form: HTMLFormElement | null = null;
  #audioplayer: HTMLDivElement | null = null;
  #tracksList: HTMLUListElement | null = null;

  #audioProgress: HTMLDivElement | null = null;
  #progressBar: HTMLDivElement | null = null;
  #barAudio: HTMLAudioElement | null = null;

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
    this.#tracksList = fullViewApp.querySelector(".list-tracks");

    body.innerHTML = "";
    body.appendChild(fullViewApp);
  }

  #bindListeners(): void {
    this.#form?.addEventListener("submit", this.#eventListeners);
  }

  #getDataFromApi(event: Event): void {
    event.preventDefault();

    const form = new FormData(this.#form!);
    const value = form.get("titleTrack") as string;

    getAudioFromApi(value.trim())
      .then((result) => {
        console.log(result);
        if (result.error) {
          this.#renderErrorMessage(result.error.message);
        } else if (result.data) {
          if (result.data.length > 0) {
            const data = result.data.map((item) => {
              return {
                isPlay: false,
                ...item,
              };
            });

            this.#arrayTracks = [...data];
            this.#renderTracks(data);
          } else {
            this.#renderNothingFound();
          }
        }
      })
      .catch((error) => {
        this.#renderErrorMessage(error);
      });

    this.#form?.reset();
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
          ? (triggerIcon.src = "./image/pause.png")
          : (triggerIcon.src = "./image/play.png");
        fragment.appendChild(element);
        return fragment;
      }, document.createDocumentFragment())
    );
  }

  #renderErrorMessage(message: string): void {
    console.log(message)
  }

  #renderNothingFound(): void {
    this.#tracksList!.innerHTML = "";
  }
}

export default App;
