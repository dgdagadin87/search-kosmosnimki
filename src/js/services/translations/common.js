import Translations from 'scanex-translations';

import {MAX_CART_SIZE, MAX_UPLOAD_OBJECTS, MAX_UPLOAD_POINTS} from '../../config/constants/constants';

Translations.addText('rus', {  
    aoi: 'Область интереса', 
    controls: {
        point: 'Маркер',
        polygon: 'Полигон',
        polyline: 'Линия',
        print: 'Печать',
        permalink: 'Постоянная ссылка',
        rectangle: 'Прямоугольник',
        download: 'Скачать',
        upload: 'Загрузить',
        zoom: 'Увеличение', 
        search: 'Поиск по кадастру, адресам, координатам',
    },
    results: {
        title: 'Найденные снимки',
        favorites: 'Корзина',
        sceneid: 'ID',
        date: 'Дата',
        satellite: 'Спутник',
        clouds: 'Обл.',
        angle: 'Угол',
        stereo: 'Стерео',
        clear: 'Очистить список',
        selected: 'Показывать выбранные / все',
        quicklooks: {
            select: 'Выбрать квиклуки',
            toggle:'Показать / скрыть выбранные квиклуки',
            cart: 'Поместить видимые в корзину'
        },
        download: 'Количество найденных снимков превышает установленный порог.<br/>Хотите скачать их в виде шейп-файла?',
        change: 'Количество найденных снимков превышает установленный порог.<br/>Измените критерий поиска.'
    },
    favorites: {
        limit: `Максимальное количество снимков в корзине - ${MAX_CART_SIZE}`,
        delete: 'Удалить выделенные',
    },
    boolean: {
        true: 'Да',
        false: 'Нет',
    },
    units: {
        m: 'м',
        km: 'км',
    },
    alerts: {
        title: 'Внимание',        
        clear: 'Удалить найденные снимки?',
        cancel: 'Отмена',
        close: 'Закрыть',
        authenticate: 'Для оформления заказа необходимо:',
        ok: 'ОК',
        login: 'Войти в систему',
        clipboard: 'Копировать ссылку',
        permalink: 'Постоянная ссылка скопирована в буфер обмена',
        nothing: 'Ничего не найдено',
        addToDrawingsHeader: 'Выберите колонку для названий объектов',
        addToDrawings: 'Добавить',
        wrongDrawings: 'Загруженные данные некорректны',

    },
    search: {
        title: 'Параметры поиска',
        action: 'Найти снимки'
    },
    cart: {
        add: 'Оформить заказ',
    },
    download: {
        type: 'Состав',     
        file: 'Имя файла',
        borders: 'Границы поиска',
        results: 'Результаты поиска: контуры',
        cart: 'Корзина: контуры',
        quicklooks: 'Корзина: контуры и квиклуки',
        ok: 'Скачать',
        cancel: 'Отмена',
        noname: 'Без имени',
        noresults: 'Нет объектов для скачивания',
        empty: "Нет объектов",
        rcsv: 'Результаты поиска: метаданные (csv)',
        ccsv: 'Корзина: метаданные (csv)'
    },
    errors: {
        permalink: 'Произошла ошибка при загрузке ссылки',
        upload: 'Произошла ошибка при загрузке файла.',
        points: `Файл содержит более ${MAX_UPLOAD_OBJECTS} объектов и/или более ${MAX_UPLOAD_POINTS} точек`
    }
});

Translations.addText('eng', {
    aoi: 'Area of interest',
    controls: {
        point: 'Marker',
        polygon: 'Polygon',
        polyline: 'Polyline',
        print: 'Print',
        permalink: 'Permalink',
        rectangle: 'Rectangle',
        download: 'Download',
        upload: 'Upload',
        zoom: 'Zoom',
        search: 'Search by cadastre, address and coordinates',
    },
    results: {
        title: 'Found images',
        favorites: 'Cart',
        sceneid: 'ID',
        date: 'Date',
        satellite: 'Satellite',
        clouds: 'Clouds',
        angle: 'Angle',
        stereo: 'Stereo',
        controls: {
            print: 'Print',
            permalink: 'Permalink',
            zoom: 'Zoom',
        },    
        clear: 'Clear results',
        selected: 'Show selected / all',
        quicklooks: {
            select: 'Select quicklooks',
            toggle: 'Show / hide selected quicklooks',
            cart: 'Add visible to cart'
        },
        download: 'Results exceed allowed items amount.<br/>Do you want to download them in a shape-file?',
        change: 'Results exceed allowed items amount.<br/>Change the criteria to limit the search.'
    },
    favorites: {
        limit: `No more than ${MAX_CART_SIZE} elements are allowed in the cart`,
        delete: 'Remove selected',
    },
    boolean: {
        true: 'Yes',
        false: 'No',
    },    
    units: {
        m: 'm',
        km: 'km',
    },
    alerts: {
        title: 'Warning',        
        clear: 'Remove found images?',
        cancel: 'Cancel',
        close: 'Close',
        authenticate: 'To place order<br/>you need to login',
        ok: 'OK',
        login: 'Login',
        clipboard: 'Copy to to clipboard',
        permalink: 'Permalink saved to clipboard',
        nothing: 'Nothing found',
        addToDrawingsHeader: 'Select column as an object name',
        addToDrawings: 'Add',
        wrongDrawings: 'Wrong data was loaded'
    },
    search: {
        title: 'Search options', 
        action: 'Search',
    },
    cart: {
        add: 'Place an order',
    },
    download: {
        type: 'Download contents',
        file: 'File name',   
        borders: 'Search borders',
        results: 'Results: contours',
        cart: 'Cart: contours',
        quicklooks: 'Cart: contours and quicklooks',
        ok: 'Download',
        cancel: 'Cancel',
        noname: 'No name',
        noresults: 'No objects to download',
        empty: "Can't download. No objects",
        rcsv: 'Results: metadata as .csv',
        ccsv: 'Cart: metadata as .csv'
    },
    errors: {
        permalink: 'Error while loading permalik',
        upload: 'Vector data upload error:',
        points: `there are more than ${MAX_UPLOAD_OBJECTS} objects or/and more than ${MAX_UPLOAD_POINTS} points in the file`
    }
});

Translations.addText('rus', {
    operator: {
        dg: 'Digital Globe, США',
        airbus: 'Airbus Defence & Space, Франция',
        siis: 'SI Imaging Services (SIIS), Южная Корея',
        ge: 'GeoEye, США',
        iinv: 'ImageSat International, N.V., Израиль',
        spaceview: 'Beijing Space View Technology Co., Ltd (Space View), КНР',
        vniiem: 'ФГУП "НПП ВНИИЭМ", Беларусь',
        blackbridge: 'BlackBridge AG, ФРГ',
        usgs: 'United States Geological Survey, США',
        roskosmos: 'Роскосмос',
        twentyfirst: 'Twenty First Century AT, China'
    }
});

Translations.addText('eng', {
    operator: {
        dg: 'Digital Globe, USA',
        airbus: 'Airbus Defence & Space, France',
        siis: 'SI Imaging Services (SIIS), South Korea',
        ge: 'GeoEye, USA',
        iinv: 'ImageSat International, N.V., Israel',
        spaceview: 'Beijing Space View Technology Co., Ltd (Space View), China',
        vniiem: 'ФГУП "НПП ВНИИЭМ", Belarus',
        blackbridge: 'BlackBridge AG, Germany',
        usgs: 'United States Geological Survey, USA',
        roskosmos: 'Roskosmos',
        twentyfirst: 'Twenty First Century AT, China'
    }
});