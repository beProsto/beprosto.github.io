
const $ = (k) => document.querySelector(k);
const $n = (k) => document.querySelectorAll(k);
const $v = (k, f) => { const els = document.querySelectorAll(k); for(const el of els) { f(el); } };


$v('p', (el)  => { el.innerHTML = "abc"; });

$n('p')[1].innerHTML = "c";

$("#abc").innerHTML = "b";