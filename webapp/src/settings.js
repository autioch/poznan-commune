/* eslint-disable object-curly-newline , object-property-newline, max-len */
import './settings.scss';
import L from 'leaflet';
import tag from 'lean-tag';

import { commune, shops } from './consts';
import agencies from './data/agencies.json';
import ranges from './data/ranges.json';
import icons from './icons';

function renderRange(polygon, color) {
  return L.geoJson(polygon, {
    color,
    fillColor: color,
    fillOpacity: 0.2,
    stroke: false
  });
}

export default function settings(mapInstance) {
  function changeVisibility(item, isVisible) {
    item.isVisible = isVisible;

    if (isVisible) {
      mapInstance.addLayer(item.layer);
    } else {
      mapInstance.removeLayer(item.layer);
    }
  }

  function changeMeasuring(item, measureCount) {
    item.isMeasured = measureCount > 0;
    item.measureCount = measureCount;
  }

  function changeRange(item, showRange) {
    item.showRange = showRange;

    Object.values(item.rangeLayers).forEach((layer) => mapInstance.removeLayer(layer));

    mapInstance.addLayer(item.rangeLayers[showRange]);
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

    group.rangeLayers = {
      '0': renderRange([], group.color),
      '100': renderRange(ranges[group.rangesKey][100], group.color),
      '200': renderRange(ranges[group.rangesKey][200], group.color),
      '300': renderRange(ranges[group.rangesKey][300], group.color),
      '400': renderRange(ranges[group.rangesKey][400], group.color),
      '500': renderRange(ranges[group.rangesKey][500], group.color)
    };
  });

  shops.forEach((group) => {
    group.layer = L.layerGroup(
      group.items.map((item) => L
        .marker([item.latitude, item.longitude], { icon: group.icon }) // eslint-disable-line object-curly-newline
        .bindPopup(`<h3>${item.address}</h3>${item.openingTimes.map((time) => `<p>${time}</p>`).join('')}`)
      )
    );
  });

  const contentEl2 = tag(
    'div.settings-container', // .is-hidden',
    tag('table.settings-table',
        tag('thead.settings-table__head',
            tag('tr', ['Item', 'Visible', 'Find closest', 'Range'].map((text) => tag('th', text)))
        ),
        tag('tbody.settings-table__body',
            commune.map((item) =>
              tag('tr',
                  tag('td',
                      tag('div.settings-item__info',
                          tag('img.settings-item__img', { src: item.iconRaw }),
                          tag('div.settings-item__label', item.label)
                      )
                  ),
                  tag('td',
                      tag('label.settings-item-checkbox',
                          tag('input.settings-item-checkbox__input', { type: 'checkbox', onchange: (ev) => changeVisibility(item, ev.target.checked) }),
                          tag('div.settings-item-checkbox__label', `Show ${item.items.length} items`)
                      )
                  ),
                  tag('td',
                      tag('select.settings-item-checkbox__select',
                          { onchange: (ev) => changeMeasuring(item, ev.target.value), value: item.measureCount },
                          [0, 1, 2, 3, 4].map((count) => tag('option', count, { value: count, selected: item.measureCount === count }))
                      )
                  ),
                  tag('td',
                      tag('select.settings-item-checkbox__select',
                          { onchange: (ev) => changeRange(item, ev.target.value), value: item.showRange },
                          [0, 100, 200, 300, 400, 500].map((range) => tag('option', `${range}m`, { value: range, selected: item.showRange === range }))
                      )
                  )
              )
            ),
            shops.map((item) =>
              tag('tr',
                  tag('td',
                      tag('div.settings-item__info',
                          tag('img.settings-item__img', { src: item.iconRaw }),
                          tag('div.settings-item__label', item.label)
                      )
                  ),
                  tag('td',
                      tag('label.settings-item-checkbox',
                          tag('input.settings-item-checkbox__input', { type: 'checkbox', onchange: (ev) => changeVisibility(item, ev.target.checked) }),
                          tag('div.settings-item-checkbox__label', `Show ${item.items.length} items`)
                      )
                  ),
                  tag('td',
                      tag('select.settings-item-checkbox__select',
                          { onchange: (ev) => changeMeasuring(item, ev.target.value), value: item.measureCount },
                          [0, 1, 2, 3, 4].map((count) => tag('option', count, { value: count, selected: item.measureCount === count }))
                      )
                  ),
                  tag('td')
              )
            )
        )
    )
  );

  const toggleEl = tag(
    'div.settings-toggle',
    {
      onclick: () => contentEl2.classList.toggle('is-hidden')
    },
    tag('img.settings-toggle__img', { src: icons.settings })
  );

  document.body.append(contentEl2, toggleEl);
}
