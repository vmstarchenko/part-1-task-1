var ws = new WebSocket('wss://part-1-task-1.herokuapp.com');
//var ws = new WebSocket('ws://localhost:8080');

ws.onopen = function (e) {
    console.log('open', e);
    ws.send(JSON.stringify({
        type: 'hi',
        mode: 'test',
        repo: 'test',
        name: 'test'
    }));
};

ws.onerror = function (e) {
    console.log('error', e);
};

ws.onclose = function (e) {
    console.log('close', e);
};

ws.onmessage = function (e) {
    var message = JSON.parse(e.data);
    console.log('message', message);
};
