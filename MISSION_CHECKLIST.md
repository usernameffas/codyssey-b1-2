# B1-2 미션 체크리스트

미션 이미지의 기능 요구사항과 보너스 항목을 저장소 구현에 대응시킨 문서입니다.

## 필수

- [x] React 프로젝트
- [x] pages / components / hooks 또는 lib 역할 분리
- [x] 공통 레이아웃
- [x] 최소 5개 라우트
- [x] 목록 라우트
- [x] 상세 라우트
- [x] 잘못된 주소 404
- [x] 네비게이션으로 주요 화면 이동
- [x] 재사용 컴포넌트 8개 이상
- [x] props 기반 표시/동작 변화
- [x] 페이지 컴포넌트와 UI 컴포넌트 분리
- [x] controlled input
- [x] 목록/상세 데이터 상태
- [x] loading/error 상태
- [x] 데이터 흐름 custom hook 1개 이상
- [x] Supabase 원격 CRUD
- [x] 목록 조회
- [x] 상세 조회
- [x] 등록
- [x] 수정
- [x] 삭제 후 목록 재조회 흐름
- [x] 필수값 검증
- [x] 입력 필드 바로 아래 오류 문구
- [x] 제출 중 버튼 비활성화/진행 상태
- [x] 요청 실패 상세 오류 표시
- [x] 이벤트 → state → 렌더링 변화
- [x] 필터 → 목록 변화
- [x] 입력 → 미리보기 변화
- [x] 저장 성공 → 알림 표시
- [x] 배포용 Vercel 설정
- [x] .env / .gitignore
- [x] README 실행 방법 및 기술 스택

## 보너스

- [x] Context 전역 상태: 테마 + 토스트
- [x] 성능 최적화: React.memo + useMemo + useCallback
- [x] Supabase Auth
- [x] 보호 라우트

## 외부 계정 단계

코드 밖에서 필요한 계정 귀속 설정은 다음 두 가지입니다.

1. Supabase 프로젝트에 `supabase/schema.sql` 실행 및 URL/anon key 발급
2. Vercel에 저장소 연결 후 같은 환경변수 등록

이 값은 민감정보/계정 자격정보이므로 Git 저장소에 넣지 않습니다.
