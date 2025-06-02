# YouTube 라이트 뷰어

YouTube 영상의 **썸네일, 제목, 채널명, 영상 재생**을 지원하는 초경량 GitHub Pages 정적 웹 뷰어입니다.

## 사용법

1. 이 저장소를 **Fork** 하거나 파일을 복사해서 본인 GitHub에 업로드
2. `Settings > Pages`에서 **branch: main, folder: /(root)** 로 설정
3. 배포된 페이지에 접속하여 유튜브 URL 또는 영상ID 입력 후 **불러오기** 클릭

## 특징

- oEmbed API로 영상 정보(썸네일/제목/채널명) 동적 로딩
- 별도의 API키, 백엔드 불필요
- 영상 시청(iframe) 지원

## 한계

- 학교/기관 네트워크에서 YouTube 차단 시 로딩/재생 불가
- oEmbed API도 동일 도메인 차단 시 정보 표시 불가
- 저작권·정책 위반 주의

## 예시

- 영상 URL: `https://youtu.be/abc123`
- 영상 ID: `abc123`
