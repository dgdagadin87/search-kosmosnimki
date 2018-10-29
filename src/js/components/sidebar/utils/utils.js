import { satellites } from '../../../config/satellites/satellites';


function createDefaultCriteria() {

    const setSatellitesChecked = (group, flag) => {
        for (let key in group) {      
            let s = group[key];
            s.checked = flag;
        }
    };

    const now = new Date();

    const dateStart = new Date(now.getFullYear(), 0, 1);
    const dateEnd = now;

    setSatellitesChecked(satellites.ms, true);
    setSatellitesChecked(satellites.pc, true);

    const defaultCriteria = {
        date: [ dateStart, dateEnd ],
        annually: false,
        clouds: [0, 100],
        angle: [0, 60],
        resolution: [0.3, 20],
        satellites: satellites,
        stereo: false,
    };

    return defaultCriteria;
}

export {createDefaultCriteria};