import 'lodash';
import './css/common.css';

import '../layout/header'

//import {firstName, lastName, year} from './math.js'

function component() {
    var element = document.createElement('div');

    /* 需要引入 lodash，下一行才能正常工作 */
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    var btn = document.createElement("BUTTON"); // Create a <button> element
    var t = document.createTextNode("CLICK ME haha 1 2 3 4 5"); // Create a text node
    btn.appendChild(t);

    document.body.appendChild(btn);

    return element;
}

document.body.appendChild(component());