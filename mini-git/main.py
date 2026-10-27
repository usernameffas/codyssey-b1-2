"""Codyssey Mini Git: a self-contained educational commit DAG CLI."""
import shlex, random, time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from collections import deque
from difflib import SequenceMatcher

def merge_sort(a,key=lambda x:x):
    """Stable O(n log n) sort, no built-in sorting."""
    if len(a)<2:return list(a)
    l=merge_sort(a[:len(a)//2],key);r=merge_sort(a[len(a)//2:],key)
    out=[];i=j=0
    while i<len(l) and j<len(r):
        if key(l[i])<=key(r[j]):out.append(l[i]);i+=1
        else:out.append(r[j]);j+=1
    return out+l[i:]+r[j:]

def insertion_sort(a,key=lambda x:x):
    """Stable O(n^2) sort used for comparison benchmark."""
    out=list(a)
    for i in range(1,len(out)):
        x=out[i];j=i-1
        while j>=0 and key(out[j])>key(x):
            out[j+1]=out[j];j-=1
        out[j+1]=x
    return out

@dataclass
class Commit:
    hash:str
    message:str
    author:str
    timestamp:datetime
    parents:list

class MiniGit:
    def __init__(self):
        self.commits={};self.branches={};self.branch=None;self.user=None
        self.words={};self.authors={};self.counter=0

    def init(self,user):
        self.__init__()
        self.user=user;self.branch='main';self.branches['main']=None
        return 'Initialized repository. Current branch: main. Current user: '+user

    def require_init(self):
        if self.branch is None:raise ValueError('Repository not initialized')

    def new_commit(self,message,parents):
        self.counter+=1
        h=f'{self.counter:08x}'
        c=Commit(h,message,self.user,datetime.now(),parents)
        self.commits[h]=c;self.branches[self.branch]=h
        self.authors.setdefault(self.user.lower(),set()).add(h)
        for w in message.lower().split():self.words.setdefault(w,set()).add(h)
        return f'[{self.branch} {h}] {message}'

    def commit(self,message):
        self.require_init();head=self.branches[self.branch]
        return self.new_commit(message,[head] if head else [])

    def branch_create(self,name):
        self.require_init()
        if name in self.branches:raise ValueError('Branch exists: '+name)
        self.branches[name]=self.branches[self.branch]
        return 'Created branch: '+name

    def switch(self,name):
        self.require_init()
        if name not in self.branches:raise ValueError('Unknown branch: '+name)
        self.branch=name;return 'Switched to branch: '+name

    def merge(self,name):
        self.require_init()
        if name not in self.branches:raise ValueError('Unknown branch: '+name)
        if name==self.branch:raise ValueError('Cannot merge branch into itself')
        a=self.branches[self.branch];b=self.branches[name]
        if a is None or b is None:raise ValueError('Both branches need commits before merge')
        if a==b:raise ValueError('Heads are identical')
        return self.new_commit('Merge branch '+name,[a,b])

    def topo_log(self):
        """DFS ensures each parent is emitted before its children."""
        seen=set();out=[]
        def visit(h):
            if h in seen:return
            seen.add(h)
            for p in self.commits[h].parents:visit(p)
            out.append(self.commits[h])
        for h in merge_sort(list(self.commits)):visit(h)
        return out

    def log(self,sort_by=None):
        self.require_init()
        if sort_by is None:data=self.topo_log()
        elif sort_by=='date':data=merge_sort(list(self.commits.values()),lambda x:(x.timestamp,x.hash))
        elif sort_by=='author':data=merge_sort(list(self.commits.values()),lambda x:(x.author.lower(),x.hash))
        else:raise ValueError('Invalid args')
        return '\n'.join(f'commit {c.hash} ({c.author}, {c.timestamp:%Y-%m-%d %H:%M:%S})\n{c.message}' for c in data) or 'No commits'

    def check_hash(self,h):
        if h not in self.commits:raise ValueError('Unknown commit: '+h)

    def ancestors(self,h):
        self.check_hash(h);seen=set();todo=list(self.commits[h].parents)
        while todo:
            x=todo.pop()
            if x in seen:continue
            seen.add(x);todo.extend(self.commits[x].parents)
        return ' '.join(merge_sort(list(seen))) or 'No ancestors'

    def path(self,start,end):
        """BFS with lexicographic neighbors resolves equally short paths."""
        self.check_hash(start);self.check_hash(end)
        graph={h:set(c.parents) for h,c in self.commits.items()}
        for h,c in self.commits.items():
            for p in c.parents:graph[p].add(h)
        q=deque([(start,[start])]);seen={start}
        while q:
            h,route=q.popleft()
            if h==end:return 'Path: '+' -> '.join(route)
            for x in merge_sort(list(graph[h])):
                if x not in seen:seen.add(x);q.append((x,route+[x]))
        return 'No path'

    def search(self,word,author=False):
        self.require_init()
        table=self.authors if author else self.words
        hs=merge_sort(list(table.get(word.lower(),set())))
        return '\n'.join(f'- {h}: {self.commits[h].message}' for h in hs) or 'No matches'

    def diff(self,one,two):
        a=Path(one).read_text(encoding='utf-8').splitlines()
        b=Path(two).read_text(encoding='utf-8').splitlines()
        out=[]
        for op,i,k,j,l in SequenceMatcher(None,a,b,autojunk=False).get_opcodes():
            if op=='equal':out.extend('  '+x for x in a[i:k])
            else:
                out.extend('- '+x for x in a[i:k])
                out.extend('+ '+x for x in b[j:l])
        return '\n'.join(out) or '(both files empty)'

    def benchmark(self,sizes=(100,500,1000)):
        lines=['size insertion_ms merge_ms same_result']
        for n in sizes:
            values=list(range(n));random.Random(n+123).shuffle(values)
            t=time.perf_counter();a=insertion_sort(values);t1=(time.perf_counter()-t)*1000
            t=time.perf_counter();b=merge_sort(values);t2=(time.perf_counter()-t)*1000
            lines.append(f'{n} {t1:.3f} {t2:.3f} {a==b}')
        return '\n'.join(lines)

    def execute(self,line):
        try:args=shlex.split(line)
        except ValueError:return 'Invalid args'
        if not args:return ''
        op=args[0].lower();rest=args[1:]
        try:
            if op in ('exit','quit') and not rest:return None
            if op=='init' and len(rest)==1:return self.init(rest[0])
            if op=='branch' and len(rest)==1:return self.branch_create(rest[0])
            if op=='switch' and len(rest)==1:return self.switch(rest[0])
            if op=='commit' and len(rest)==1:return self.commit(rest[0])
            if op=='merge' and len(rest)==1:return self.merge(rest[0])
            if op=='log' and not rest:return self.log()
            if op=='log' and len(rest)==1 and rest[0].startswith('--sort-by='):return self.log(rest[0].split('=',1)[1])
            if op=='path' and len(rest)==2:return self.path(*rest)
            if op=='ancestors' and len(rest)==1:return self.ancestors(rest[0])
            if op=='search' and len(rest)==1:
                if rest[0].startswith('--author='):return self.search(rest[0][9:],True)
                return self.search(rest[0])
            if op=='diff' and len(rest)==2:return self.diff(*rest)
            if op=='benchmark' and not rest:return self.benchmark()
            return 'Invalid args'
        except (ValueError,OSError,UnicodeError) as e:return str(e)

def main():
    app=MiniGit()
    while True:
        try:line=input('mini-git> ')
        except (EOFError,KeyboardInterrupt):print();break
        output=app.execute(line)
        if output is None:break
        if output:print(output)

if __name__=='__main__':main()
