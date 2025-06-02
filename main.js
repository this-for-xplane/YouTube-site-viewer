function extractVideoId(url) {
  url = url.trim();
  if (url.startsWith("http")) {
    let m = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/);
    return m ? m[1] : "";
  }
  return url;
}

async function loadVideo() {
  const input = document.getElementById('yt-input').value;
  const id = extractVideoId(input);
  if (!id) {
    document.getElementById('info').innerHTML = '<span style="color:red;">유효한 ID/URL이 아닙니다.</span>';
    document.getElementById('player').innerHTML = "";
    return;
  }

  // oEmbed API로 썸네일+제목+채널 정보(공식 API키 불필요, 차단시 실패)
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  let meta;
  try {
    meta = await (await fetch(oembedUrl)).json();
  } catch (e) {
    document.getElementById('info').innerHTML = '<span style="color:red;">영상 정보를 불러올 수 없습니다.</span>';
    document.getElementById('player').innerHTML = "";
    return;
  }

  // 썸네일/제목/채널 표시
  document.getElementById('info').innerHTML = `
    <h3>${meta.title}</h3>
    <p>채널: ${meta.author_name}</p>
    <img src="${meta.thumbnail_url}" alt="썸네일" style="max-width:320px">
  `;

  // 영상 시청(iframe embed)
  document.getElementById('player').innerHTML = `
    <iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>
  `;
}

document.getElementById('load-btn').onclick = loadVideo;
