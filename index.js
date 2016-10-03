var ws = new WebSocket('wss://part-1-task-1.herokuapp.com');
//var ws = new WebSocket('ws://localhost:8080');

var lastTask;

ws.onopen = function (e) {
  console.log('open', e);
  ws.send(JSON.stringify({
    type: 'hi',
    mode: 'complete',
    repo: 'https://github.com/vmstarchenko/part-1-task-1',
    name: 'vmstarchenko'
  }));

  // send tasks
  startTask('groups');
};

ws.onerror = function (e) {
  console.log('error', e);
};

ws.onclose = function (e) {
  console.log('close', e);
};

ws.onmessage = function (e) {
  var data = JSON.parse(e.data);
  switch (data.taskName) {
  case 'echo':
    TaskEcho(data);
    break;
  case 'reverse':
    TaskReverse(data);
    break;
  case 'sum':
    TaskSum(data);
    break;
  case 'calc':
    TaskCalc(data);
    break;
  case 'median':
    TaskMedian(data);
    break;
  case 'groups':
    TaskGroups(data);
    break;
    //case 'recurrence':
    //TaskRecurrence(data);
    //break;
  }
  if (data.type === 'askComplete') {
    if (lastTask === 'sum') {
      ws.send(JSON.stringify({
        type: 'answer',
        data: TaskSum.sum,
      }));
      TaskSum.sum = 0;
    } else if (lastTask === 'groups') {
      var groups = TaskGroups.groups;
      var keys = Object.keys(groups);
      keys.sort(function(a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
      });
      var ans = [];
      for (var i=0, size=keys.length; i < size; ++i) {
        ans.push(groups[keys[i]]);
      }
      ws.send(JSON.stringify({
        type: 'answer',
        data: ans,
      }));
      TaskGroups.groups = [];
    }
  }
};

function startTask(taskName) {
  ws.send(JSON.stringify({type: 'task', task: taskName}));
}

// You can run task: {"type":"task","task":"taskName"}
// Available tasks: ["echo","reverse","sum","calc","median","groups","recurrence","validator","recurrence2"]

function TaskEcho(data) { // 1
  if (data.type === 'ask') {
    ws.send(JSON.stringify({type: 'answer', data: data.data}));
  }
}

function TaskReverse(data) { // 2
  if (data.type === 'ask') {
    ws.send(JSON.stringify({
      type: 'answer',
      data: data.data.split("").reverse().join(""),
    }));
  }
}

function TaskSum(data) {
  lastTask = 'sum';
  if (data.type === 'askComplete') {
    ws.send(JSON.stringify({
      type: 'answer',
      data: TaskSum.sum,
    }));
  } else if (data.type === 'ask') {
    TaskSum.sum += data.data;
  }
}
TaskSum.sum = 0;

function TaskCalc(data) { // 4
  if (data.type === 'ask') {
    ws.send(JSON.stringify({
      type: 'answer',
      data: eval(data.data),
    }));
  }
}

function TaskMedian(data) { // 5
  if (data.type === 'ask') {
    TaskMedian.array.push(data.data);
    TaskMedian.array.sort(function(a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
    });
    ws.send(JSON.stringify({
      type: 'answer',
      data: TaskMedian.array[TaskMedian.array.length >> 1],
    }));
  }
}
TaskMedian.array = [];

function TaskGroups(data) { // groups
  lastTask = 'groups';
  if (data.type === 'askComplete') {
    ws.send(JSON.stringify({
      type: 'answer',
      data: TaskGroups.groups,
    }));
  } else if (data.type === 'ask') {
    var group = data.data.group,
        value = data.data.value;
    if (TaskGroups.groups[group]) {
      TaskGroups.groups[group].push(value);
    } else {
      TaskGroups.groups[group] = [value];
    }
  }
}
TaskGroups.groups = {};


// Object.equal = function( Obj1, Obj2 ){
//   if (Obj1 === Obj2)
//     return true;
//   var keys1 = Object.keys( Obj1 );
//   var keys2 = Object.keys( Obj2 );
//   if ( Obj1.length != keys2.length ) {
//     return false;
//   }
//   return !keys1.filter(function( key ){
//     if ( typeof Obj1[key] == "object" ||  Array.isArray( Obj1[key] ) ) {
//       return !Object.equal(Obj1[key], Obj2[key]);
//     } else {
//       return Obj1[key] !== Obj2[key];
//     }
//   }).length;
// };
// function TaskRecurrence(data) { // 7
//   if (data.type === 'ask') {
//     var d = data.data;
//     var contained = false;
//     for (var i=0, size=d.length; i < size; ++i) {
//       if (Object.equal(TaskRecurrence.set[i], d)) {
//         contained = true;
//         break;
//       }
//     }
//     ws.send(JSON.stringify({
//       type: 'answer',
//       data: contained
//     }));
//     TaskRecurrence.set.push(d);
//   }
// }
// TaskRecurrence.set = [];
