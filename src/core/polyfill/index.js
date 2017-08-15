'use strict';

import './createElement';
import './replaceWith';

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};  