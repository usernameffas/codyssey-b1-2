import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const exists = (p) => fs.existsSync(path.join(root, p))
const failures = []
const checks = []

function check(name, condition) {
  checks.push([name, Boolean(condition)])
  if (!condition) failures.push(name)
}

const app = read('src/App.jsx')
const componentFiles = fs.readdirSync(path.join(root, 'src/components')).filter((f) => f.endsWith('.jsx'))
const sourceFiles = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(jsx|js)$/.test(entry.name)) sourceFiles.push(full)
  }
}
walk(path.join(root, 'src'))
const source = sourceFiles.map((p) => fs.readFileSync(p, 'utf8')).join('\n')

check('React Router 라우트 5개 이상', (app.match(/<Route\b/g) || []).length >= 5)
check('Not Found 라우트', app.includes('path="*"'))
check('목록 라우트', app.includes('path="/items"'))
check('상세 라우트', app.includes('path="/items/:id"'))
check('등록 라우트', app.includes('path="/items/new"'))
check('재사용 컴포넌트 8개 이상', componentFiles.length >= 8)
check('controlled input / useState', source.includes('useState'))
check('useEffect 사용', source.includes('useEffect'))
check('custom hook useItems', exists('src/hooks/useItems.js'))
check('custom hook useItemDetail', exists('src/hooks/useItemDetail.js'))
check('Supabase CRUD service', ['select(', '.insert(', '.update(', '.delete()'].every((token) => read('src/lib/itemService.js').includes(token)))
check('Context 전역 상태 보너스', exists('src/context/AppContext.jsx'))
check('React.memo 성능 최적화 보너스', read('src/components/ItemCard.jsx').includes('memo('))
check('useMemo 성능 최적화 보너스', read('src/pages/ItemsPage.jsx').includes('useMemo'))
check('Supabase Auth 보너스', read('src/pages/LoginPage.jsx').includes('signInWithPassword'))
check('보호 라우트 보너스', exists('src/components/ProtectedRoute.jsx'))
check('.env Git 제외', read('.gitignore').split(/\r?\n/).includes('.env'))
check('환경변수 예시 제공', exists('.env.example'))
check('Vercel SPA rewrite', exists('vercel.json'))
check('Supabase 스키마 제공', exists('supabase/schema.sql'))
check('README 제공', exists('README.md'))

for (const [name, ok] of checks) console.log(`${ok ? '[OK]' : '[FAIL]'} ${name}`)

if (failures.length) {
  console.error(`\n검증 실패 ${failures.length}건`)
  process.exit(1)
}
console.log(`\n총 ${checks.length}개 정적 검증 통과`)
