import unittest
from main import MiniGit,merge_sort,insertion_sort
class MiniGitTests(unittest.TestCase):
    def setUp(self):self.g=MiniGit();self.g.init('Alice')
    def test_init(self):self.assertEqual(self.g.branches['main'],None)
    def test_commit_search(self):
        self.g.commit('Hello World')
        self.assertIn('Hello World',self.g.search('world'))
        self.assertIn('Hello World',self.g.search('alice',True))
    def test_merge_topo(self):
        self.g.commit('first');self.g.branch_create('feature')
        self.g.switch('feature');self.g.commit('second')
        self.g.switch('main');self.g.commit('third');self.g.merge('feature')
        self.assertEqual(len(self.g.commits[self.g.branches['main']].parents),2)
        ids=[x.hash for x in self.g.topo_log()]
        self.assertTrue(all(ids.index(p)<ids.index(c.hash) for c in self.g.commits.values() for p in c.parents))
    def test_path_ancestors(self):
        self.g.commit('one');self.g.commit('two')
        self.assertEqual(self.g.path('00000001','00000002'),'Path: 00000001 -> 00000002')
        self.assertEqual(self.g.ancestors('00000002'),'00000001')
    def test_sort(self):
        expected=[-1,0,1,2,3,5,5];values=[5,1,2,5,3,0,-1]
        self.assertEqual(merge_sort(values),expected)
        self.assertEqual(insertion_sort(values),expected)
    def test_commands(self):
        self.assertIn('00000001',self.g.execute('COMMIT "Hello world"'))
        self.assertEqual(self.g.execute('switch missing'),'Unknown branch: missing')
        self.assertEqual(self.g.execute('bad'),'Invalid args')
if __name__=='__main__':unittest.main()
