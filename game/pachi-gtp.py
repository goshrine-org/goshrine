#!/usr/bin/python3

import subprocess

def coord_gen(size):
    for x in range(size):
        for y in range(size):
            c1 = chr(ord('A') + x + int(x > 7))
            c2 = str(y + 1)
            yield c1 + c2

def pachi_evaluate_sgf(handle):
    p = subprocess.run('./pachi/tools/sgf2gtp.pl', stdin=handle, capture_output=True)
    gtp  = p.stdout
    gtp += b'final_status_list alive\n'
    gtp += b'final_status_list dead\n'
    gtp += b'final_status_list black_territory\n'
    gtp += b'final_status_list white_territory\n'
    gtp += b'final_status_list seki\n'

    p = subprocess.run('./pachi/pachi', input=gtp, capture_output=True)
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
    board = set(coord_gen(19))
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

with open('/home/ronald/Downloads/f2486aa7.sgf', 'r') as f:
    print(pachi_evaluate_sgf(f))
