const appTemplate = document.createElement("template");

appTemplate.innerHTML = ` 
<div class="wrapper">
<header class="header">
  <div class="container">
    <div class="header__body">
      <div class="header__row">
        <div class="header__title">Music App</div>
        <div class="header-form">
          <form class="form-search">
            <div class="search__field">
              <input
                name="titleTrack"
                type="search"
                class="search__input"
                placeholder="Rihanna"
                required
                maxlength = '30'
              />
            </div>
            <button type="submit" class="search__btn">search</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</header>
<main class="main">
  <div class="container">
    <div class="main__body">
      <div class="audioplayer" data-id-track="">
        <div class="audioplayer__body">
          <div class="audioplayer__row">
            <div class="audioplayer-image">
              <img
                class="image__album"
                src="./images/question.png"
                alt="audioplayer-image"
              />
            </div>

            <div class="audioplayer-details">
              <div class="details-title__artist">Unknown</div>
              <div class="details-title__track">Unknown</div>
            </div>

            <div class="audioplayer-progress">
              <div class="progress-bar">
                <audio id="bar-audio"></audio>
              </div>
              <div class="progress__start-time">00:00</div>
              <div class="progress__finish-time">00:00</div>
            </div>

            <div class="audioplayer-display">
              <div class="display-prev">
                <button type="click" class="prev-btn">
                  <img
                    class="prev-btn__icon"
                    src="./images/prev.png"
                    alt="prev"
                  />
                </button>
              </div>
              <div class="display-trigger">
                <button
                  type="click"
                  class="trigger-btn"
                  data-on-trigger="false"
                >
                  <img
                    class="trigger-btn__icon"
                    src="./images/play.png"
                    alt="trigger"
                  />
                </button>
              </div>
              <div class="display-next">
                <button type="click" class="next-btn">
                  <img
                    class="next-btn__icon"
                    src="./images/next.png"
                    alt="next"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tracks">
        <div class="tracks__body">
          <div class="tracks-results">
            <div class="results-search">Search: <span class = 'results-search__text'>unknown</span></div>
            <div class="results-count">Results: <span class = 'results-count__text'>0</span></div>
          </div>
          <div class = 'tracks-loader'></div>
          <ul class="list-tracks">
            <li class = 'tracks-start-message'>
              <div class = 'start-message__text'>Enter the artist name or audio title.</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</main>
<footer class="footer">
  <div class="container">
    <div class="footer__body">
      <div class="footer__row">
        <div class="footer-github">
          <a
            href="https://github.com/Dimalogin/"
            target="_blank"
            class="github-link"
            >Github</a
          >
        </div>
        <div class="footer-year">2023</div>
        <div class="footer-logo">
          <a
            href="https://rs.school/js-stage0/"
            target="_blank"
            class="logo__link"
          >
            <img src="./images/logoRss.svg" class="logo__icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
</div>`;

export default appTemplate;
