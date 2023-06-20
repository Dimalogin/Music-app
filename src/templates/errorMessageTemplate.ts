const erroMessageTemplate = document.createElement("template");

erroMessageTemplate.innerHTML = `
<li class = 'list-error-message'>
  <div class = 'error-message'>Error: <span class = 'error-message__text'></span></div>
</li>
`;

export default erroMessageTemplate;
