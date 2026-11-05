# Figma B1-2 디자인 시안 갤러리

이 문서는 Figma에 별도 프레임으로 보존한 각 시안을 연결합니다. 각 URL의 `node-id`가 특정 프레임을 가리키므로 다른 시안을 편집해도 해당 프레임은 유지됩니다. 단, Figma 파일/프레임 자체를 삭제하면 링크는 더 이상 열리지 않습니다. **영구 백업을 위해 .fig 로컬 사본과 PNG/PDF 내보내기를 추가로 권장합니다.**

| 상태 | 시안 | Figma 편집 링크 |
|---|---|---|
| 보존 | 01 첫 달력 | https://www.figma.com/design/ths2Mcj7bBaciCXLVzuuBG?node-id=1-2 |
| 보존 | 02 기록 작성 | https://www.figma.com/design/ths2Mcj7bBaciCXLVzuuBG?node-id=1-3 |
| 보존 | 03 기록 상세 | https://www.figma.com/design/ths2Mcj7bBaciCXLVzuuBG?node-id=1-4 |
| 보존 | 04 오른쪽 상세 패널형 달력 | https://www.figma.com/design/ths2Mcj7bBaciCXLVzuuBG?node-id=5-2 |
| 보존 | 05 주간 제목 표시형 달력 | https://www.figma.com/design/ths2Mcj7bBaciCXLVzuuBG?node-id=9-2 |
| **최종 선정** | 06 월간 제목 표시형 달력 | https://www.figma.com/design/ths2Mcj7bBaciCXLVzuuBG?node-id=11-2 |

## 백업 형식과 용도
- **.fig:** Figma의 편집 가능한 원본 사본. Figma의 File > Save local copy 로 저장한 후 GitHub 저장소에 보관. 버전 히스토리/댓글은 포함되지 않음.
- **.png:** 시안별 고정 이미지. GitHub README에 삽입할 수 있고 Figma 변경 뒤에도 이미지가 바뀌지 않음.
- **.pdf:** 여러 시안의 읽기 전용 비교본. 시각적 표현은 보존하지만 Figma 레이어 편집성이 유지되지는 않음.
- **Figma 프레임 링크:** 현재 디자인 파일 안의 특정 프레임으로 이동. 원본 편집에 가장 적합하지만 파일 소유자와 공유 권한에 의존.

## 보존 정책
시안을 새로 만들더라도 위 프레임을 삭제하지 않고, 완성된 시안마다 고유 이름과 프레임 링크를 추가합니다. 사용자 선택에 따라 월간(06)을 기본 디자인으로 유지하며 오른쪽 패널형(04)에서 선택 날짜만 갱신하는 구조도 참고합니다. 날짜 칸에는 기록 제목 전체 또는 앞부분이 보여야 합니다.

## 구현과 시안의 차이
웹사이트의 날짜별 CRUD는 개발 코드에 반영된 반면, **서로 다른 학습 기록 간 관계를 저장하는 링크/체인 기능**과 회고 메모는 별도 데이터 모델과 UI 구현이 필요한 다음 단계입니다. 제목 텍스트만 붙여놓은 것을 기능 완료로 취급하지 않습니다.
