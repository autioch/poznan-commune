import { getDbTable, saveOutput } from './utils.mjs';
import { AGENCY_COLORS } from './consts.mjs';

(async () => {
  const agencies = getDbTable('agency').reduce((obj, agency) => {
    const { agency_id, agency_name, agency_url, agency_phone } = agency;

    obj[agency_id] = {
      label: agency_name,
      url: agency_url,
      phone: agency_phone,
      color: AGENCY_COLORS[agency_id]
    };

    return obj;
  }, {});

  await saveOutput('agencies', agencies, true);
})();
