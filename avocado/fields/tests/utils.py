from django.test import TestCase

from avocado.columns.models import Column
from avocado.fields.utils import M, AmbiguousField
from avocado.modeltree import ModelTree

__all__ = ('MTestCase',)

ORIG_MODEL_TREE = M.modeltree

class MTestCase(TestCase):
    fixtures = ['test_data.yaml']
    
    def setUp(self):
        M.modeltree = ORIG_MODEL_TREE
    
    def test_error(self):
        M.modeltree = None
        self.assertRaises(RuntimeError, M, failing__test=4)
        
    def test_variations(self):
        concepts = Column.objects.filter(M(translator='Simple'))
        self.assertEqual(len(concepts), 4)
        
        concepts = Column.objects.filter(M(translator__icontains='Sim'))
        self.assertEqual(len(concepts), 4)
        
        concepts = Column.objects.filter(M(avocado__modelfield__translator='Simple'))
        self.assertEqual(len(concepts), 4)
        
        concepts = Column.objects.filter(M(avocado__modelfield__translator__icontains='Sim'))
        self.assertEqual(len(concepts), 4)
        M.modeltree = None
        
        concepts = Column.objects.filter(M(ORIG_MODEL_TREE,
            translator='Simple'))
        self.assertEqual(len(concepts), 4)
        
        concepts = Column.objects.filter(M(ORIG_MODEL_TREE,
            translator__icontains='Sim'))
        self.assertEqual(len(concepts), 4)
        
        concepts = Column.objects.filter(M(ORIG_MODEL_TREE,
            avocado__modelfield__translator='Simple'))
        self.assertEqual(len(concepts), 4)
        
        concepts = Column.objects.filter(M(ORIG_MODEL_TREE,
            avocado__modelfield__translator__icontains='Sim'))
        self.assertEqual(len(concepts), 4)

    def test_ambiguous(self):
        self.assertRaises(AmbiguousField, M, name='Foo')