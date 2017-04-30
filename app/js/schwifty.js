/* eslint no-console: 0 */
/* global window, document, localforage, fetch */
import 'notie/dist/notie.min.css';
import 'normalize.css';

import { alert, confirm } from 'notie';

import 'App/sass/schwifty.scss';
import store from 'App/redux/store.js';

import { showElement } from 'App/redux/actions/dom';
import { search } from 'App/redux/actions/search';
import { asyncUserIsLoggedIn, authorizeSpotify, logout } from 'App/redux/actions/user';
import { match } from 'App/redux/actions/match';
import time from 'App/js/time';

store.subscribe(() => {
});

store
  .dispatch(asyncUserIsLoggedIn())
  .then(() => {
    showElement('#profile');
  }, () => {
    showElement('#login-container');
  });

document.querySelector('#search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  search(document.querySelector('#search-input').value).then((matches) => {
    if (matches.length === 0) {
      alert({
        type: 'neutral',
        text: "That's deep - I can't do that",
      });
      return;
    }

    store.dispatch(match(matches));

    document.querySelector('#schwifty-411').innerHTML = `Schwifty got <b>${matches.length}</b> track${matches.length > 1 ? 's' : ''}`;
    document.querySelector('.match').innerHTML = `<div class="track-list">${matches.map(m => `<div class="track">
      <div class="track__image">
        <img src="${m.album.images[1] ? m.album.images[1].url : 'app/static/placeholder.png'}" />
      </div>

      <div class="track__info">
        <div class="ashamed">
          <p class="track__name" class="text-white">${m.name}</p>
          <span class="track__artist text-mute">${m.artists.map(artist => artist.name).join(', ')}</span>
        </div>
      </div>

      <div class="ashamed-two-times">
        ${m.explicit ? '<span class="track__explicit">E</span>' : ''}
        <div class="track__duration text-mute">${time(m.duration_ms)}</div>
      </div>
    </div>`).join('')}</div>`;
  }, (err) => {
    alert({
      type: 'error',
      text: err,
    });
  });
}, false);

document.querySelector('#login').addEventListener('click', () => {
  authorizeSpotify();
}, false);

document.querySelector('#logout').addEventListener('click', () => {
  confirm({
    text: 'Logout?',
    submitCallback() {
      logout();
    },
  });
}, false);
