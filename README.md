# Codyssey B1-2 — Study Records

React 18과 Supabase로 만든 SPA(Single Page Application)입니다.  
미션 **“버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기”**의 필수 요구사항과 보너스 3가지를 코드에 반영했습니다.

## 구현 범위

### 필수
- React 18 + Vite
- React Router 기반 SPA
- 8개 라우트: `/`, `/login`, `/items`, `/items/new`, `/items/:id`, `/items/:id/edit`, `/profile`, `*`
- 목록/상세/등록/수정/삭제 CRUD
- Supabase 원격 데이터 사용
- 재사용 UI 컴포넌트 8개 이상
- controlled input
- 필드별 유효성 검증 및 오류 표시
- 제출 중 버튼 비활성화/상태 표시
- 목록/상세 로딩, 오류, 빈 데이터 상태
- `useItems`, `useItemDetail` 커스텀 훅
- 사용자 이벤트 → state 변경 → 재렌더링
- 404 Not Found
- 환경변수 분리 및 `.gitignore`
- Vercel SPA rewrite 설정
- README 실행/기술 스택/검증 절차

### 보너스
1. **전역 상태**: `AppContext`로 테마와 토스트 알림 관리
2. **성능 최적화**: `React.memo`, `useMemo`, `useCallback`
3. **인증**: Supabase Auth 로그인/회원가입 + 보호 라우트

## 기술 스택

- React 18
- React Router 6
- Supabase JS
- Vite
- Vitest
- React Testing Library
- CSS
- Vercel 배포 설정

## 프로젝트 구조

```text
src/
├─ components/        # 재사용 UI 컴포넌트
├─ context/           # 전역 상태 / 인증
├─ hooks/             # 데이터 조회 커스텀 훅
├─ lib/               # Supabase 및 CRUD 서비스
├─ pages/             # 라우트 페이지
├─ test/              # 컴포넌트 테스트
├─ App.jsx
├─ main.jsx
└─ styles.css
supabase/
└─ schema.sql          # 테이블/RLS/트리거/인덱스
scripts/
└─ verify.mjs          # 미션 요구사항 정적 검사
```

## 실행

Node.js 20 권장.

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다.
3. Authentication에서 Email 로그인을 사용합니다.
4. Project Settings/API에서 URL과 anon key를 `.env`에 넣습니다.
5. 배포 서비스에도 같은 두 환경변수를 별도로 등록합니다.

`items` 테이블은 RLS가 활성화되어 있으며 로그인한 사용자는 자신의 데이터만 읽기/등록/수정/삭제할 수 있습니다.

## 라우팅

| 경로 | 역할 | 보호 |
|---|---|---|
| `/` | 홈 | X |
| `/login` | 로그인/회원가입 | X |
| `/items` | 목록 | O |
| `/items/new` | 등록 | O |
| `/items/:id` | 상세 | O |
| `/items/:id/edit` | 수정 | O |
| `/profile` | 프로필 | O |
| `*` | 404 | X |

## CRUD 흐름

### 목록
`/items` → `useItems()` → `fetchItems()` → Supabase `select` → state 저장 → 렌더링

### 상세
`/items/:id` → `useParams()` → `useItemDetail(id)` → Supabase 단건 조회 → 렌더링

### 등록
controlled input → 검증 → `createItem()` → 저장 성공 → 토스트 → 상세 화면 이동

### 수정
기존 데이터 로드 → 폼 state 변경 → `updateItem()` → 토스트 → 상세 화면 이동

### 삭제
상세 화면 → 삭제 확인 → `deleteItem()` → 목록 이동 → 목록 재조회

## React 이벤트 → 상태 → 렌더링

```text
사용자 입력/클릭
→ 이벤트 핸들러
→ setState 또는 비동기 CRUD
→ 상태 변경
→ React 재렌더링
→ 화면 변경
```

구현 예:
- 검색어 입력 → `query` 변경 → `useMemo` 필터 결과 변경 → 목록 재렌더링
- 폼 입력 → `form` state 변경 → 미리보기 즉시 변경
- 저장/수정/삭제 성공 → Context 토스트 state 변경 → 알림 표시
- 테마 버튼 → Context theme 변경 → 전체 UI 테마 변경

## 로딩/에러/빈 상태

- `Loading`: 목록/상세/인증 확인
- `ErrorState`: 네트워크·권한·환경변수·조회 오류
- `EmptyState`: 데이터가 없는 목록
- 폼 오류는 해당 입력 바로 아래 표시
- 등록/수정/삭제 처리 중에는 버튼 비활성화 및 진행 문구 표시

## 자동 검증

```bash
npm run verify
npm test
npm run build
```

`npm run verify`는 다음을 검사합니다.

- 5개 이상 라우트
- 목록/상세/등록/404
- 8개 이상 재사용 컴포넌트
- state/useEffect
- custom hook
- Supabase CRUD
- Context 보너스
- memoization 보너스
- Auth/보호 라우트 보너스
- 환경변수 보안
- Supabase 스키마
- Vercel rewrite
- README

GitHub Actions에서도 push/PR마다 verify → test → build 순으로 수행합니다.

## 테스트

현재 포함된 테스트:
- 필수 입력 누락 시 필드별 오류 표시
- 유효한 controlled input 제출
- 빈 목록 EmptyState
- 목록 카드 및 상세 링크 렌더링

## Vercel 배포

저장소를 Vercel에 Import하고 다음 환경변수를 등록합니다.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Build Command: `npm run build`  
Output Directory: `dist`

`vercel.json`의 rewrite 설정으로 상세/수정 URL을 새로고침해도 SPA가 유지됩니다.

## 미션 요구사항 대응표

| 미션 요구 | 구현 |
|---|---|
| 최소 5개 라우트 | `src/App.jsx` |
| 목록/상세 라우트 | `ItemsPage`, `ItemDetailPage` |
| Not Found | `NotFoundPage` |
| 공통 레이아웃 | `Layout`, `Header` |
| 재사용 컴포넌트 8개+ | `src/components/` |
| props에 따른 표시/동작 | `Button`, `ItemCard`, `ErrorState` 등 |
| 페이지/UI 분리 | `pages/`, `components/` |
| controlled input | `ItemForm` |
| 목록/상세 state | `useItems`, `useItemDetail` |
| loading/error | `Loading`, `ErrorState` |
| custom hook | `src/hooks/` |
| 원격 CRUD | `src/lib/itemService.js` |
| 등록/수정 검증 | `ItemForm` |
| 제출 중 상태 | 등록/수정/삭제 페이지 |
| 이벤트→상태→렌더링 | 검색, 미리보기, 토스트, 테마 |
| 배포 설정 | `vercel.json` |
| 전역 상태 보너스 | `AppContext` |
| 성능 보너스 | `ItemCard`, `ItemsPage`, hooks/context |
| 인증 보너스 | `AuthContext`, `LoginPage`, `ProtectedRoute` |
| 보안 | `.gitignore`, `.env.example`, RLS |

## 실제 배포 전 최종 확인 순서

1. 회원가입/로그인
2. 빈 목록 상태
3. 새 기록 등록
4. 상세 조회
5. 수정
6. 검색 필터
7. 삭제
8. 로그아웃
9. 보호 라우트 접근 시 `/login` 이동
10. 존재하지 않는 URL에서 404
11. 모바일 폭에서 헤더/카드/폼 확인

Supabase 프로젝트 URL과 anon key는 계정에 귀속되는 외부 자격정보이므로 저장소에는 포함하지 않습니다.
