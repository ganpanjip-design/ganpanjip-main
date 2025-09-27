/*
1. 링크는 버튼 따로 없이 http://기존링크/admin-secu 에서 접근 가능. 접근시 비밀번호 확인 요함
    password: .env.local에 ADMIN_PWD로 존재
2. 비밀번호 확인 후 게시물 작성 페이지로 이동: 접근 시마다 비번확인O

게시물 구성
- 제목input text
- 서브제목input text
- 날짜 (default: 현재시각) date
- 작품 타입 [work/original] radio
- 주최자input text
- 태그 ??
- 썸네일: 이미지/gif 등록 (s3서버에 올림 -> db에는 s3서버에 올라가있는 url을 저장)
- 설명글 input text
- 영문 설명글 input text
- data:
    grid: 1~4선택 가능 (해당 그리드마다 스타일시트 지정)
    media: 이미지/gif등록 (썸네일과 같은 처리방식)
*/