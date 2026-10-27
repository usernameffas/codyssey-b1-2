# Codyssey Mini Git (필수 + 보너스 3개)

Python 3.10+, 외부 패키지 없음. `python main.py` 로 실행.

- 필수: INIT, BRANCH, SWITCH, COMMIT, LOG, LOG --sort-by=date|author, PATH, ANCESTORS, SEARCH, SEARCH --author
- 커밋 DAG / 부모 우선 로그 / 무방향 BFS 최단 경로 / 메시지와 작성자 역색인 / 직접 구현한 병합 정렬
- 보너스 1: `diff file1 file2` 줄 단위 공통/추가/삭제
- 보너스 2: `merge branch` 두 부모를 갖는 병합 커밋
- 보너스 3: `benchmark` 삽입 정렬 O(n²) / 병합 정렬 O(n log n) 성능 비교

```sh
python main.py
# init "Alice"
# commit "First commit"
# branch feature
# switch feature
# commit "Add login"
# switch main
# commit "Main update"
# merge feature
# log
# search login
# log --sort-by=date
# ancestors 00000004
# benchmark
# quit

python -m unittest discover -v
```

주의: 기본 LOG는 부모 먼저, 옵션 LOG는 선택한 필드로 정렬됩니다. 모든 커밋 데이터는 메모리에 저장됩니다. 메시지 검색은 공백 분리된 단어 단위입니다. 표준 정렬 API인 `sorted` 와 `.sort` 는 사용하지 않습니다. 원래 2026-10-25 ZIP의 원본 파일을 찾을 수 없어 2026-10-28에 원문을 기준으로 재구성했습니다. 원래 41개 테스트와 이번 테스트는 별개입니다.
