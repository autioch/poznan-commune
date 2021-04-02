/* eslint-disable object-curly-newline , object-property-newline, max-len */
import './settings.scss';
import L from 'leaflet';
import tag from 'lean-tag';

import { commune, shops } from './consts';
import agencies from './data/agencies.json';
import icons from './icons';

const mapById = new Map([...commune, ...shops].map((item) => [item.id, item]));

export default function settings(mapInstance) {
  function changeVisibility(id, isVisible) {
    const item = mapById.get(id);

    item.isVisible = isVisible;

    if (isVisible) {
      mapInstance.addLayer(item.layer);
    } else {
      mapInstance.removeLayer(item.layer);
    }
  }
  function changeMeasuring(id, isMeasured) {
    const item = mapById.get(id);

    item.isMeasured = isMeasured;
  }

  function getStopPopup({ zoneId, stopName, routeIds, agencyIds }) {
    return `
    <h3>${zoneId} ${stopName}</h3>
    <p>Linie: ${routeIds.join(', ')}</p>
    ${agencyIds.map((agencyId) => `<p>${agencies[agencyId].label.replace('Sp. z o.o.', '').trim()}</p>`).join('')}
  `;
  }

  commune.forEach((group) => {
    group.layer = L.layerGroup(
      group.items
        .map((item) => L
          .marker([item.latitude, item.longitude], { icon: group.icon }) // eslint-disable-line object-curly-newline
          .bindPopup(getStopPopup(item))
        )
    );
  });

  shops.forEach((group) => {
    group.layer = L.layerGroup(
      group.items.map((item) => L
        .marker([item.latitude, item.longitude], { icon: group.icon }) // eslint-disable-line object-curly-newline
        .bindPopup(`<h3>${item.address}</h3>${item.openingTimes.map((time) => `<p>${time}</p>`).join('')}`)
      )
    );
  });

  const contentEl = tag(
    'div.settings-container.is-hidden',
    tag('div.settings-header', 'Transport'),
    commune.map((item) => tag(
      'div.settings-item',
      tag('img.settings-item__img', { src: item.iconRaw }),
      tag('div.settings-item__label', item.label),
      tag('label.settings-item-checkbox',
          tag('input.settings-item-checkbox__input', { type: 'checkbox', onchange: (ev) => changeVisibility(item.id, ev.target.checked) }),
          tag('div.settings-item-checkbox__label', 'Show')
      ),
      tag('label.settings-item-checkbox',
          tag('input.settings-item-checkbox__input', { type: 'checkbox', onchange: (ev) => changeMeasuring(item.id, ev.target.checked) }),
          tag('div.settings-item-checkbox__label', 'Measure distance')
      )
    )),
    tag('div.settings-header', 'Infrastructure'),
    shops.map((item) => tag(
      'div.settings-item',
      tag('img.settings-item__img', { src: item.iconRaw }),
      tag('div.settings-item__label', item.label),
      tag('label.settings-item-checkbox',
          tag('input.settings-item-checkbox__input', { type: 'checkbox', onchange: (ev) => changeVisibility(item.id, ev.target.checked) }),
          tag('div.settings-item-checkbox__label', 'Show')
      ),
      tag('label.settings-item-checkbox',
          tag('input.settings-item-checkbox__input', { type: 'checkbox', onchange: (ev) => changeMeasuring(item.id, ev.target.checked) }),
          tag('div.settings-item-checkbox__label', 'Measure distance')
      )
    ))
  );

  const toggleEl = tag(
    'div.settings-toggle',
    {
      onclick: () => contentEl.classList.toggle('is-hidden')
    },
    tag('img.settings-toggle__img', { src: icons.settings })
  );

  document.body.append(contentEl, toggleEl);
}
