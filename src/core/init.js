
import '../styles/index.scss';
import './polyfill';
import wrapper from './view/templates/wrapper';
import search from './view/templates/search';
import table from './view/templates/table';
import pagination from './view/templates/pagination';
import { dispatch, Store } from './store';

function Init(initParams = {}) {
    const response = {
        searchField: initParams.searchField,
        sortField: initParams.sortField,
        predicates: initParams.predicates,
        currentPage: initParams.currentPage
    };
    const store = new Store({ initParams: initParams, dispatch: dispatch, response: response});
    
    const docFrag = wrapper(store, {
        children: [
            search(store),
            table(store),
            pagination(store)
        ]
    });
    store.dispatch({
        type: 'LOAD_TABLE'        
    });
    return docFrag;
}


export default Init;