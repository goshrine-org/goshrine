from django.db.utils import IntegrityError
from django.test import TestCase
from users.models import User

class ConstraintsTestCase(TestCase):
    def setUp(self):
        pass
#        u = User.objects.create(login='')
#        Game.objects.create()

    def test_constraint_login_empty(self):
        with self.assertRaises(IntegrityError):
            User.objects.create(login='', email='test@test.com')

    def test_constraint_login_too_small_1(self):
        with self.assertRaises(IntegrityError):
            User.objects.create(login='a', email='test@test.com')

    def test_constraint_login_too_small_2(self):
        with self.assertRaises(IntegrityError):
            User.objects.create(login='aa', email='test@test.com')

    def test_constraint_login_unique(self):
        User.objects.create(login='test', email='test@test.com')
        with self.assertRaises(IntegrityError):
            User.objects.create(login='test', email='test2@test.com')

    def test_constraint_login_case_unique(self):
        User.objects.create(login='test', email='test@test.com')
        with self.assertRaises(IntegrityError):
            User.objects.create(login='Test', email='test2@test.com')

    def test_constraint_email_empty(self):
        with self.assertRaises(IntegrityError):
            User.objects.create(login='test', email='')

    def test_email_too_small_1(self):
        with self.assertRaises(IntegrityError):
            User.objects.create(login='test', email='@')

    def test_email_too_small_2(self):
        with self.assertRaises(IntegrityError):
            User.objects.create(login='test', email='x@')

    def test_constraint_email_unique(self):
        User.objects.create(login='test', email='test@test.com')
        with self.assertRaises(IntegrityError):
            User.objects.create(login='test2', email='test@test.com')

    def test_constraint_email_case_unique(self):
        User.objects.create(login='test', email='test@test.com')
        with self.assertRaises(IntegrityError):
            User.objects.create(login='test2', email='Test@test.com')
