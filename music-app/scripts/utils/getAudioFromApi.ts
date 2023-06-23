import ViewReturnedObject from "../../interfaces/ViewReturnedObject";

const AUDIO_API_KEY = "148876c30dmsh350b605b3f1a2fcp1f672djsnc49000cde9f7";
const AUDIO_API_HOST = "deezerdevs-deezer.p.rapidapi.com";

function getAudioFromApi(title: string): Promise<ViewReturnedObject> {
  return fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${title}`, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": AUDIO_API_KEY,
      "X-RapidAPI-Host": AUDIO_API_HOST,
    },
  })
    .then((res) => res.json())
    .then((res) => res);
}

export default getAudioFromApi;
