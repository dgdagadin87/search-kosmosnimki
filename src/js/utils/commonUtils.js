import { LAYER_ATTRIBUTES, LAYER_ATTR_TYPES } from '../config/layers/layers';
import { satellites } from '../config/satellites/satellites';

import { tileRange } from './layersUtils';


function isNumber(n) {

    return !isNaN (new Number(n));
}

function createContainer () {

    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
}

function getWindowCenter () {

    const {left, top, width, height} = document.body.getBoundingClientRect();
    return {left: left + Math.round (width / 2), top: top + Math.round(height / 2)};
}

function getMapCenter () {

    const headerBounds = document.getElementById('header').getBoundingClientRect();
    const {top, left} = getWindowCenter ();
    return {top: top + headerBounds.top + headerBounds.height, left};
}

function isMobile () {

    let browserCheckString = navigator.userAgent || navigator.vendor || window.opera;
    let stringSubstr = browserCheckString.substr(0,4);

    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(browserCheckString) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(stringSubstr);
}

function _f (arr, acc, swap) {
    if (arr.length) {
        let r = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            let a = arr[i];
            if (_f(a, acc, swap)) {
                if (swap) {
                    r.unshift(a);
                }
                else {
                    r.push(a);
                }
            }
        }
        if (r.length) {
            acc.push(r);
        }
        return false;
    }
    else {
        return true;
    }
}

function flatten (arr, swap) {
    let acc = [];
    _f(arr, acc, swap);
    return acc;
}

function getTotalHeight (parts) {
    return parts.reduce((a, x) => a + document.body.querySelector(x).getBoundingClientRect().height, 0);
};

function uppercaseFirstLetter(stringValue) {

    if (typeof stringValue !== 'string') return ''
    return stringValue.charAt(0).toUpperCase() + stringValue.slice(1)
}

function makeCloseTo (lng, x) {
    let dist = (a,b) => Math.abs (a - b);
    let {p} = [x - 360, x, x + 360]
    .map(p => {
        return {p, d: dist (lng, p)};
    })
    .reduce((a,{p,d}) => {
        if (a === null || d < a.d) {
            a = {d, p};
        }
        return a;
    }, null);
    return p;
}

function stRange (start, end, boxes) {            
    let rng = [];
    let lo = getQuarters (start);
    let hi = getQuarters (end);
    for (let i = lo; i <= hi; i++) {
        boxes.forEach (box => {
            tileRange (i, box).forEach (n => rng.push(n));
        });        
    }
    return rng;
}

function toQuery (range) {    
    return `${range.length > 0 ? `stidx IN (${range.join(',')})` : '' }`;
}

function getQuarters (date) {
    return (date.getFullYear() - 1970) * 4 + Math.ceil ((date.getMonth() + 1) / 3);
}

function getCorrectIndex(index) {

    return LAYER_ATTRIBUTES.indexOf(index) + 1;
}

function propertiesToItem(properties) {

    if (!properties) {
        return null;
    }

    const lastPropertyIndex = properties ? properties.length - 1 : 0;

    return properties.slice(1, lastPropertyIndex).reduce((propertyObject, value, index) => {
        
        let attrKey = LAYER_ATTRIBUTES[index];
        
        switch (LAYER_ATTR_TYPES[index]){
            case 'date':
                if (typeof value === 'string') {
                    propertyObject[attrKey] = new Date(value);
                }
                else if (typeof value === 'number') {
                    propertyObject[attrKey] = new Date(value * 1000);
                }
                break;                
            default:
                propertyObject[attrKey] = value;
                break;
        }           
        return propertyObject;
    },{});
}

function getSatelliteName (platform) {

    const getName = (a, x) => {    
        return x.platforms.reduce((b, y) => {
            b[y] = x.name;
            return b;
        }, a);
    };

    let names = satellites.ms.reduce(getName, {});
    names = satellites.pc.reduce(getName, names);

    return names[platform];
}

function getPanelHeight (container, parts) {

    return parts.reduce((a,x) => {
        return a - container.querySelector(x).getBoundingClientRect().height;
    }, container.getBoundingClientRect().height);
}

export {
    isNumber,
    createContainer,
    getWindowCenter,
    getMapCenter,
    isMobile,
    flatten,
    getTotalHeight,
    uppercaseFirstLetter,
    makeCloseTo,
    stRange,
    toQuery,
    getQuarters,
    getCorrectIndex,
    propertiesToItem,
    getSatelliteName,
    getPanelHeight
};