'use strict'
var url = 'https://time-radish.glitch.me';
init();

function init() {
  fetch(url + '/posts').then(function(response) {
    return response.json();
  }).then(function(data) {
    loadPage(data.posts);
    console.log(data.posts);
  })
}
function loadPage(data) {
  var allMessages = document.getElementById('mainContent');
  var username = document.getElementById('login');
  var logoutLink = document.getElementById('logout');
  data = data.reverse();
  logoutLink.addEventListener('click', logout);

  if (window.localStorage.username) {
    username.innerText = window.localStorage.username;
    username.href = '##';
    username.classList.add('loginSuccess');
    logoutLink.style.display = 'inline-block';
  } else {
    username.innerText = 'LOGIN';
    username.style.cursor = 'cursor';
  }
  allMessages.innerHTML = '';
  data.forEach(function(value, index) {
    var messageContainer = document.createElement('div');
    var count = document.createElement('div');
    var contentLeft = document.createElement('div');
    var imageUp = document.createElement('img');
    var voteText = document.createElement('span');
    var imageDown = document.createElement('img');
    var contentRight = document.createElement('div');
    var title = document.createElement('span');
    var submitTime = document.createElement('span');
    var submitTimeTxt = new Date().getTime() - parseInt(value.timestamp);
    console.log(new Date().getTime());
    console.log(value.timestamp);
    var change = document.createElement('span');
    var modify = document.createElement('a');
    var remove = document.createElement('a');
    messageContainer.classList.add('container');
    count.classList.add('count');
    count.innerHTML = index + 1;
    contentLeft.classList.add('content-left');
    imageUp.classList.add('upvote');
    imageUp.classList.add('vote-img');
    imageUp.src = '../imgs/upvote.png';
    imageUp.addEventListener('click', function() { changeVoteState(value.id, 'upvote', imageUp, imageDown) });
    imageUp.addEventListener('click', changeVote);
    voteText.innerText = value.score;
    imageDown.classList.add('downvote');
    imageDown.classList.add('vote-img');
    imageDown.src = '../imgs/downvote.png';
    imageDown.addEventListener('click', function() { changeVoteState(value.id, 'downvote', imageUp, imageDown) });
    imageDown.addEventListener('click', changeVote);
    contentRight.classList.add('content-right');
    title.classList.add('title');
    title.innerHTML = value.title;
    submitTime.classList.add('submit-time');
    submitTimeTxt = formatTime(submitTimeTxt);
    submitTime.innerHTML = `submitted ${submitTimeTxt} ago by ${value.owner || 'anonymous'}`;
    change.classList.add('change');
    modify.addEventListener('click', function() { deliver(value.href, value.title, value.id, modify) });
    modify.href = '##';
    modify.innerHTML = 'modify';
    remove.href = '##';
    remove.innerHTML = 'remove';
    remove.addEventListener('click', function() { deleteInfo(value.id) });
    contentLeft.appendChild(imageUp);
    contentLeft.appendChild(voteText);
    contentLeft.appendChild(imageDown);
    change.appendChild(modify);
    change.appendChild(remove);
    contentRight.appendChild(title);
    contentRight.appendChild(submitTime);
    contentRight.appendChild(change);
    messageContainer.appendChild(count);
    messageContainer.appendChild(contentLeft);
    messageContainer.appendChild(contentRight);
    allMessages.appendChild(messageContainer);
  })
}
function formatTime(seconds) {
  var theSecond = Math.ceil(seconds / 1000) < 0 ? 0 : Math.ceil(seconds / 1000);
  var theMinute = 0;
  var theHour = 0;
  var result = "" + Math.ceil(theSecond % 60) + " seconds ";
  if (theSecond > 60) {
    theMinute = parseInt(theSecond / 60);
    theSecond = parseInt(theSecond % 60);
    if (theMinute > 60) {
      theHour = parseInt(theMinute / 60);
      theMinute = parseInt(theMinute % 60);
    }
  }
  if (theMinute > 0) {
    result = "" + parseInt(theMinute) + " minutes " + result;
  }
  if (theHour > 0) {
    result = "" + parseInt(theHour) + " hours " + result;
  }
  return result;
}
function changeVote() {
  var target = event.currentTarget;
  var picUp = event.path[1].children[0];
  var picDown = event.path[1].children[2];
  var vote = event.path[1].children[1];
  var voteText = Number(vote.innerText);
  if (target.classList.contains('upvote')) {
    if (votedOrNot(picUp, picDown) === 'downvoted') {
      voteText += 2;
    } else {
      voteText += 1;
    }
    vote.classList.add('downvoted-color');
    target.classList.remove('upvote');
    target.classList.add('upvoted');
    target.src = '../imgs/upvoted.png';
    picDown.classList.remove('downvoted');
    picDown.classList.add('downvote');
    picDown.src = '../imgs/downvote.png';
  }
  else if (target.classList.contains('downvote')) {
    if (votedOrNot(picUp, picDown) === 'upvoted') {
      voteText -= 2;
    } else {
      voteText -= 1;
    }
    vote.classList.add('downvoted-color');
    target.classList.remove('downvote');
    target.classList.add('downvoted');
    target.src = '../imgs/downvoted.png';
    picUp.classList.remove('upvoted');
    picUp.classList.add('upvote');
    picUp.src = '../imgs/upvote.png';
  }
  else if (target.classList.contains('upvoted')) {
    vote.classList.remove('downvoted-color');
    target.classList.remove('upvoted');
    target.classList.add('upvote');
    target.src = '../imgs/upvote.png';
    voteText -= 1;
  }
  else {
    vote.classList.remove('downvoted-color');
    target.classList.remove('downvoted');
    target.classList.add('downvote');
    target.src = '../imgs/downvote.png';
    voteText += 1;
  }
  // console.log(`after: ${voteText}`);
  vote.innerText = voteText;
}
function votedOrNot(picUp, picDown) {
  if (picDown.classList.contains('downvoted')) {
    return 'downvoted';
  }
  else if (picUp.classList.contains('upvoted')) {
    return 'upvoted';
  } else {
    return 'notvote'
  }
}
function deleteInfo(id) {
  event.preventDefault();
  fetch(url + '/posts/' + id, {
    method: 'delete',
    headers: {
      'Accept': 'application/json'
    }
  }).then(function(response) {
    console.log('success');
    var allMessages = document.getElementById('mainContent');
    allMessages.innerHTML = '';
    init()
  })
}
function changeVoteState(id, token, picUp, picDown) {
  var voteFlag = votedOrNot(picUp, picDown);
  if (voteFlag === 'upvoted' && token === 'upvote') {
    token = 'downvote';
  }
  else if (voteFlag === 'downvoted' && token === 'downvote') {
    token = 'upvote';
  }
  else if ((voteFlag === 'downvoted' && token === 'upvote') ||
    (voteFlag === 'upvoted' && token === 'downvote')) {
    putVote(id, token);
  }
  putVote(id, token);
}
function putVote(id, token) {
  fetch(`${url}/posts/${id}/${token}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json'
    }
  }).then(function(response) {
    console.log(response);
  })
}
function deliver(href, title, id, modifylink) {
  modifylink.href = `../html/modify.html?id=${id}&href=${href}&title=${title}`;
}
function logout() {
  var myStorage = window.localStorage;
  var username = document.getElementById('login');
  var logoutLink = document.getElementById('logout');
  myStorage.removeItem('username');
  username.innerText = 'LOGIN';
  username.href = '../html/login.html';
  username.classList.remove('loginSuccess');
  logoutLink.style.display = 'none';
}
setInterval(init, 3 * 1000)