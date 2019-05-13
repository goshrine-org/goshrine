
class InvalidMoveError(Exception):
    pass

class Board(object):
    def __init__(self, size=19):
        self.size      = size
        self.board     = [[None for i in range(size)] for j in range(size)]
        self.turn      = 'b'
        self.ko_coord  = None
        self.last_move = None
        self.captures  = { 'b': 0, 'w': 0 }

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
        return self.board[coord[1]][coord[0]]

    def set(self, coord, value):
        assert value in [None, 'b', 'w']
        self.board[coord[1]][coord[0]] = value

    def move(self, coord):
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
        self.last_move = coord
