const trackItemTemplate = document.createElement("template");

trackItemTemplate.innerHTML = `<li class="list-track track ">
<div class="track-description">
  <div class="description-artist">
    <img
      class="artist__icon"
      src=""
    />
    <button class="artist-trigger">
      <img
        class="trigger__icon"
        src=""
        alt="trigger"
      />
    </button>
  </div>
  <div class="description-title">
    <div class="title__artist"></div>
    <div class="title__track"></div>
  </div>
</div>
<div class="track-time"></div>
</li>`;

export default trackItemTemplate;