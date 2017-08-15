'use strict';

import { $ } from'./core/entry';
window.$ = $;

$('#table-test').tableInit({
    name: 'test',
    sequenceColumn: { firstName: 'First name', lastName:'Last name', email:'Email' }
});