let i = 0;
postMessage(i);
onmessage = function(e) {
  postMessage(++i)
}