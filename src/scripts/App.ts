import AppTemplate from "../templates/AppTemplate";

class App {
  render() {
    this.#initAppTemplate();
  }

  #initAppTemplate() {
    const body = document.body;
    const fullViewApp = AppTemplate.content.cloneNode(true) as DocumentFragment;

    body.innerHTML = "";
    body.appendChild(fullViewApp);
  }
}

export default App;
