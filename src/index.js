'use strict';

import { $ } from'./core/entry';
window.$ = $;

$('#table-test').tableInit({
    name: 'test',
    searchField: 'firstName',
    sortField: 'firstName',
    isAsc: false,
    sequenceColumn: { firstName: 'First name', lastName:'Last name', email:'Email' }
});