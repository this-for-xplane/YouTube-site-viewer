// 콘솔 로그를 웹에도 출력하는 기능 (console hijack)
(function setupWebConsole() {
  const logElem = document.getElementById('console-log');
  function writeLog(msg, type="log") {
    let color;
    switch(type) {
      case "error": color = "#ff6b6b"; break;
      case "warn": color = "#ffe066"; break;
      default: color = "#fff";
    }
    logElem.innerHTML += `<span style="color:${color}">${msg}</span>\n`;
    logElem.scrollTop = logElem.scrollHeight;
  }
  // 원래 콘솔 저장
  const originLog = console.log;
  const originErr = console.error;
  const originWarn = console.warn;

  console.log = function(...a) {
    writeLog(a.map(x=>typeof x==="object"?JSON.stringify(x):x).join(" "), "log");
    originLog.apply(console, a);
  };
  console.error = function(...a) {
    writeLog(a.map(x=>typeof x==="object"?JSON.stringify(x):x).join(" "), "error");
    originErr.apply(console, a);
  };
  console.warn = function(...a) {
    writeLog(a.map(x=>typeof x==="object"?JSON.stringify(x):x).join(" "), "warn");
    originWarn.apply(console, a);
  };

  // 전역 에러 핸들러
  window.addEventListener("error", function(e) {
    writeLog("[Error] " + (e.message || e), "error");
  });
  window.addEventListener("unhandledrejection", function(e) {
    writeLog("[Promise] " + (e.reason && e.reason.message ? e.reason.message : e.reason), "error");
  });
})();


function extractVideoId(url) {
  url = url.trim();
  if (url.startsWith("http")) {
    let m = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/);
    return m ? m[1] : "";
  }
  return url;
}

let currentId = "";

async function loadVideoInfo() {
  const input = document.getElementById('yt-input').value;
  const id = extractVideoId(input);
  currentId = id;
  document.getElementById('player').innerHTML = "";

  console.log("입력값:", input, "| 추출된 영상ID:", id);

  if (!id) {
    document.getElementById('info').innerHTML = '<span style="color:red;">유효한 ID/URL이 아닙니다.</span>';
    console.warn("ID 추출 실패: 입력값이 유효하지 않음");
    return;
  }

  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  let meta;
  try {
    meta = await (await fetch(oembedUrl)).json();
    console.log("oEmbed API 결과:", meta);
  } catch (e) {
    document.getElementById('info').innerHTML = '<span style="color:red;">영상 정보를 불러올 수 없습니다.</span>';
    console.error("oEmbed API 오류:", e);
    return;
  }

  document.getElementById('info').innerHTML = `
    <h3>${meta.title}</h3>
    <p>채널: ${meta.author_name}</p>
    <img src="${meta.thumbnail_url}" alt="썸네일" style="max-width:320px">
    <br>
    <button id="play-btn" style="margin-top:1em;">영상 재생</button>
  `;

  document.getElementById('play-btn').onclick = playVideo;
}

function playVideo() {
  if (currentId) {
    document.getElementById('player').innerHTML = `
      <iframe src="https://www.youtube.com/embed/${currentId}" allowfullscreen></iframe>
    `;
    console.log("iframe 생성:", `https://www.youtube.com/embed/${currentId}`);
  }
}

document.getElementById('load-btn').onclick = loadVideoInfo;
