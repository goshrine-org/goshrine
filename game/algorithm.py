
import subprocess

class InvalidCoordinateError(Exception):
    pass

class InvalidMoveError(Exception):
    pass

class Board(object):
    def __init__(self, size=19):
        self.size      = size
        self.board     = [[None for i in range(size)] for j in range(size)]
        self.turn      = 'b'
        self.ko_coord  = None
        self.captures  = { 'b': 0, 'w': 0 }
        self.end       = False
        self.moves     = []
        self.rules     = "japanese"
        self.komi      = 6.5

    def translate(self, coord):
        x = ord(coord[0]) - ord('a')
        y = self.size - (ord(coord[1]) - ord('a')) - 1
        return (x, y)

    def __str__(self):
        s = ''

        for row in reversed(self.board):
            for pos in row:
                if pos is None:
                    s += '. '
                else:
                    s += pos + ' '
            s += '\n'
        s += "B: {}         W: {}".format(self.captures['b'], self.captures['w'])

        return s

    def neighbours(self, coord):
        x, y = coord
        if y + 1 < self.size:
            yield (x, y + 1)
        if x + 1 < self.size:
            yield (x + 1, y)
        if y > 0:
            yield (x, y - 1)
        if x > 0:
            yield (x - 1, y)

    def group(self, coord):
        color = self.get(coord)
        if color == None: return set()

        seen  = set((coord,))
        queue = [coord]

        while queue:
            c = queue.pop(0)

            for cn in self.neighbours(c):
                if self.get(cn) == color and cn not in seen:
                    queue.append(cn)
                    seen.add(cn)

        return seen

    def captured(self, group):
        if len(group) == 0: return False

        for c in group:
            for cn in self.neighbours(c):
                if self.get(cn) == None:
                    return False

        return True

    def suicide(self, coord, color=None):
        assert self.get(coord) is None

        if color is None: color = self.turn

        # Make a mock move; we will undo it later.
        self.set(coord, color)

        # Check if we have liberties, or could have after capture.
        for cn in self.neighbours(coord):
            ncolor = self.get(cn)

            # Neighbour is a liberty, so we are done.
            if ncolor is None:
                self.set(coord, None)
                return False

            # If our neighbour is in the same group, we skip it.
            if ncolor == color: continue

            # Our neighbour belongs to the opponent, check if the group has
            # been captured with our move.
            if self.captured(self.group(cn)):
                self.set(coord, None)
                return False

        # See if we would be captured ourselves.
        suicide = self.captured(self.group(coord))
        self.set(coord, None)
        return suicide

    def validate(self, coord, color=None):
        if color is None: color = self.turn

        # See if the coordinate we got is sane.
        self.coord_validate(coord)

        # Occupied; we cannot move here.
        if self.get(coord) is not None:
            raise InvalidMoveError(f'There already is a stone here.')

        # Check if this isn't suicide.
        if self.suicide(coord, color):
            raise InvalidMoveError(f'Suicide is not allowed under Japanese rules.')

        # Finally we check for basic-ko.  Every time a single stone is taken we
        # set the ko coordinate for the next turn (this one), so we can simply
        # check if we are trying to put our stone there.
        # We do this after the suicide rule, to differentiate better between
        # error messages: after a single stone was taken, it could be suicide
        # rather than basic-ko preventing the move.
        if self.ko_coord == coord:
            raise InvalidMoveError(f'Cannot retake the ko.')

    def get(self, coord):
        x, y = self.coord_validate(coord)
        return self.board[y][x]

    def set(self, coord, value):
        assert value in [None, 'b', 'w']
        x, y = self.coord_validate(coord)
        self.board[y][x] = value

    def move(self, coord):
        if coord is None: return self._pass_move()

        self.validate(coord)

        # We are after validation, so we reset the ko position.
        self.ko_coord = None
        self.set(coord, self.turn)

        # Resolve captures.  We only need to check our neighbours.
        for cn in self.neighbours(coord):
            ncolor = self.get(cn)
            if ncolor is None or ncolor == self.turn: continue

            group = self.group(cn)
            if self.captured(group):
                self.captures[self.turn] += len(group)
                for cg in group:
                    self.set(cg, None)

                # If the captured group was 1 stone, set it as a basic ko.
                # We will validate this next turn.
                if len(group) == 1: self.ko_coord = cg

        if self.turn == 'b': self.turn = 'w'
        else: self.turn = 'b'
        self.moves.append(coord)

    def _pass_move(self):
        self.ko_coord  = None

        if self.moves and self.moves[-1] == 'pass':
            self.end = True

        if self.turn == 'b': self.turn = 'w'
        else: self.turn = 'b'
        self.moves.append('pass')

    def coord_validate(self, coord):
        x, y = coord
        if x < 0 or x >= self.size or y < 0 or y >= self.size:
            raise InvalidCoordinateError()
        return coord

    def gtp_coord(self, coord):
        x, y = self.coord_validate(coord)
        return chr(ord('A') + x + (x > 7)) + str(y + 1)

    def gtp(self):
        print(self.moves)
        yield f'kgs-rules {self.rules}'
        yield f'boardsize {self.size}'
        yield f'komi {self.komi}'
        yield 'clear_board'

        for i, move in enumerate(self.moves):
            if move == 'pass': continue
            yield 'play {} {}'.format("BW"[i % 2], self.gtp_coord(move))

    def pachi_evaluate(self):
	# We use pachi to evaluate territory and captures etc.
        data = self.pachi_run_evaluate()

        # Convert the dead stones to captured stones by color.
        dead_stones_by_color = { 'black': [], 'white': [] }
        for group in data['dead']:
            if not group: continue

            group = [self.gtp_to_gs_coord(c) for c in group]
            coord = self.translate(group[0])

            if self.get(coord) == 'b':
                dead_stones_by_color['black'] += group
            else:
                dead_stones_by_color['white'] += group

        del(data['alive'], data['dead'], data['seki'])
        data['black'] = [self.gtp_to_gs_coord(c) for c in data['territory-black']]
        del(data['territory-black'])
        data['white'] = [self.gtp_to_gs_coord(c) for c in data['territory-white']]
        del(data['territory-white'])
        data['dame']  = [self.gtp_to_gs_coord(c) for c in data['dame']]
        data['dead_stones_by_color'] = dead_stones_by_color

        return data

    def _gtp_coord_gen(self):
        for x in range(self.size):
            for y in range(self.size):
                c1 = chr(ord('A') + x + int(x > 7))
                c2 = str(y + 1)
                yield c1 + c2

    def gtp_to_gs_coord(self, s):
        assert len(s) in (2, 3)

        x = ord(s[0]) - ord('A')
        x = chr(x - int(x > 7) + ord('a'))
        y = chr(self.size - int(s[1:]) + ord('a'))
        return x + y

    def pachi_run_evaluate(self):
        gtp  = '\n'.join(self.gtp())
        gtp += 'final_status_list alive\n'
        gtp += 'final_status_list dead\n'
        gtp += 'final_status_list black_territory\n'
        gtp += 'final_status_list white_territory\n'
        gtp += 'final_status_list seki\n'
        gtp  = gtp.encode('ascii')

        p = subprocess.run('/home/goshrine/goshrine/game/pachi/pachi', input=gtp, capture_output=True)
        results = filter(None, p.stdout.decode('ascii').split('\n\n'))
        results = list(results)[-5:]

        alive = results[0].lstrip('= ').split('\n')
        alive = [i.split() for i in alive]
        dead  = results[1].lstrip('= ').split('\n')
        dead  = [i.split() for i in dead]
        black = results[2].lstrip('= ').split()
        white = results[3].lstrip('= ').split()
        seki  = results[4].lstrip('= ').split()

        # We can calculate dame by the previous results.
        board = set(self._gtp_coord_gen())
        got   = set()
        got.update(item for sublist in alive for item in sublist)
        got.update(item for sublist in dead  for item in sublist)
        got.update(black)
        got.update(white)

        return {
            'alive'          : alive,
            'dead'           : dead,
            'territory-black': black,
            'territory-white': white,
            'dame'           : list(board-got),
            'seki'           : seki,
        }
