function createContainer () {

    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
}

function getWindowCenter () {

    const {left, top, width, height} = document.body.getBoundingClientRect();
    return {left: left + Math.round (width / 2), top: top + Math.round(height / 2)};
}

export {createContainer, getWindowCenter};