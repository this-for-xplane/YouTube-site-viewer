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
  document.getElementById('player').innerHTML = ""; // 영상 영역 초기화

  if (!id) {
    document.getElementById('info').innerHTML = '<span style="color:red;">유효한 ID/URL이 아닙니다.</span>';
    return;
  }

  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  let meta;
  try {
    meta = await (await fetch(oembedUrl)).json();
  } catch (e) {
    document.getElementById('info').innerHTML = '<span style="color:red;">영상 정보를 불러올 수 없습니다.</span>';
    return;
  }

  document.getElementById('info').innerHTML = `
    <h3>${meta.title}</h3>
    <p>채널: ${meta.author_name}</p>
    <img src="${meta.thumbnail_url}" alt="썸네일" style="max-width:320px">
    <br>
    <button id="play-btn" style="margin-top:1em;">영상 재생</button>
  `;

  // "영상 재생" 버튼 이벤트 연결
  document.getElementById('play-btn').onclick = playVideo;
}

function playVideo() {
  if (currentId) {
    document.getElementById('player').innerHTML = `
      <iframe src="https://www.youtube.com/embed/${currentId}" allowfullscreen></iframe>
    `;
  }
}

document.getElementById('load-btn').onclick = loadVideoInfo;
