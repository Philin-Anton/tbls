'use strict';

import { $ } from'./core/entry';
window.$ = $;

$('#table-test').tableInit({
    name: 'test',
    searchField: 'firstName',
    sortField: 'firstName',
    isAsc: false,
    sequenceColumn: [
        {
            fieldName: 'firstName',
            value: 'First name'
        },
        {
            fieldName: 'lastName',
            value: 'Last name'
        },
        {
            fieldName: 'email',
            value: 'Email'
        }
    ]
});

// document.getElementById('table-test2').tableInit({ //its work
//     name: 'test2',
//     searchField: 'firstName',
//     sortField: 'firstName',
//     isAsc: false,
//     sequenceColumn: [
//         {
//             fieldName: 'firstName',
//             value: 'First name'
//         },
//         {
//             fieldName: 'lastName',
//             value: 'Last name'
//         },
//         {
//             fieldName: 'email',
//             value: 'Email'
//         }
//     ]
// });