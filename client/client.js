const form = document.querySelector('form');
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:5000/mews';

listAllMews();

function listAllMews() {
  mewsElement.innerHTML = '';
  fetch(API_URL)
    .then(response => response.json())
    .then(mews => {
      mews.forEach(mew => {
        const div = document.createElement('div');
        const name = document.createElement('h3');
        const content = document.createElement('p');
        div.classList.add('mew');
        name.textContent = mew.name;
        content.textContent = mew.content;
        div.appendChild(name);
        div.appendChild(content);
        mewsElement.appendChild(div);
      });
    });
}

function load() {
  const loading = document.querySelector('#loading');
  const progress = document.querySelector('#progress');
  let width = 0;

  loading.style.display = 'block';

  function frame() {
    if (width > 100) {
      width = 0;
      loading.style.display = 'none';
      progress.style.width = `${width}%`;
      form.style.display = '';
      clearInterval(interval);
    } else {
      width += 1;
      progress.style.width = `${width}%`;
      progress.textContent = `${width}%`;
    }
  }

  const interval = setInterval(frame, 1);
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('mew');

  const mew = {
    name,
    content,
  };

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(mew),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(response => response)
    .then(createdMew => {
      form.reset();
      console.log(createdMew);
    });

  load();
});
