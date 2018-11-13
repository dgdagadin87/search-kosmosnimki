import Translations from 'scanex-translations';


export default class View {

    constructor({ sidebarView }) {

        return sidebarView.addTab({
            id: 'results',            
            icon: 'sidebar-results',
            opened: 'sidebar-results-opened',
            closed: 'sidebar-results-closed',
            tooltip: Translations.getText('results.title')
        })
    }

}