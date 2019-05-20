from django.db.utils import IntegrityError
from django.test import TestCase
from users.models import User
from .models import Game

class ConstraintsTestCase(TestCase):
    def setUp(self):
        self.p1 = User.objects.create(login='player1', email='player1@test.com')
        self.p2 = User.objects.create(login='player2', email='player2@test.com')
        self.u  = User.objects.create(login='someone', email='someone@test.com')

    def test_constraint_resignation_none_result_br(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                result="B+R"
            )

    def test_constraint_resignation_u_result_br(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                resigned_by=self.u,
                result="B+R"
            )

    def test_constraint_resignation_u_result_wr(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                resigned_by=self.u,
                result="W+R"
            )

    def test_constraint_resignation_u_result_xxx(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                resigned_by=self.u,
                result="XXX"
            )

    def test_constraint_resignation_b_result_br(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                resigned_by=self.p1,
                result="B+R"
            )

    def test_constraint_resignation_b_result_wr(self):
        g = Game.objects.create(
            black_player=self.p1,
            white_player=self.p2,
            resigned_by=self.p1,
            result="W+R"
        )
        self.assertIsNotNone(g)

    def test_constraint_resignation_w_result_br(self):
        g = Game.objects.create(
            black_player=self.p1,
            white_player=self.p2,
            resigned_by=self.p2,
            result="B+R"
        )
        self.assertIsNotNone(g)

    def test_constraint_resignation_w_result_wr(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                resigned_by=self.p2,
                result="W+R"
            )

    def test_constraint_resignation_self_play_br(self):
        g = Game.objects.create(
            black_player=self.p1,
            white_player=self.p1,
            resigned_by=self.p1,
            result="B+R"
        )
        self.assertIsNotNone(g)

    def test_constraint_resignation_self_play_wr(self):
        g = Game.objects.create(
            black_player=self.p1,
            white_player=self.p1,
            resigned_by=self.p1,
            result="W+R"
        )
        self.assertIsNotNone(g)

    def test_constraint_resignation_b_result_xxx(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                resigned_by=self.p1,
                result="XXX"
            )

    def test_constraint_turn_b(self):
        g = Game.objects.create(
            black_player=self.p1,
            white_player=self.p1,
            turn='b'
        )
        self.assertIsNotNone(g)

    def test_constraint_turn_w(self):
        g = Game.objects.create(
            black_player=self.p1,
            white_player=self.p1,
            turn='w'
        )
        self.assertIsNotNone(g)

    def test_constraint_turn_B(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                turn='B'
            )

    def test_constraint_turn_W(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                turn='W'
            )

    def test_constraint_turn_x(self):
        with self.assertRaises(IntegrityError):
            Game.objects.create(
                black_player=self.p1,
                white_player=self.p2,
                turn='x'
            )
