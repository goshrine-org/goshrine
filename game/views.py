from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .forms import MatchCreateForm, MatchProposeForm
from django.core.validators import RegexValidator, ValidationError
from users.models import User
from rooms.models import Room, RoomChannel
from game.models import Game

def game(request, token):
    token_validator = RegexValidator("^[a-f0-9]+$")

    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    return render(request, 'game/game.html', {'game': game})

def game_sgf(request, token):
    token_validator = RegexValidator("^[a-f0-9]+$")

    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    res = HttpResponse(game.sgf(), content_type='application/x-go-sgf; charset=utf-8')
    return res

def game_for_eidogo(request, token):
    token_validator = RegexValidator("^[a-f0-9]+$")

    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    s = {}
    s['dame'] = []
    s['white'] = []
    s['black'] = []
    s['dead_stones_by_color'] = { 'black': [], 'white': [] }
    s['score'] = {
        'white_territory_count': 10,
        'black_territory_count': 10,
        'white': 20,
        'black': 11,
    }

    g = {}
    g['black_capture_count'] = game.black_capture_count
    g['black_player_id']     = game.black_player.id
    g['black_player_rank']   = game.black_player.rank
    g['black_seconds_left']  = game.black_seconds_left
    g['byo_yomi']            = game.byo_yomi
    g['finished_at']         = game.finished_at
    g['game_type']           = game.game_type
    g['handicap']            = game.handicap
    g['id']                  = game.board.id
    g['komi']                = game.komi
    g['last_move']           = game.last_move
    g['main_time']           = game.main_time
    g['match_request_id']    = 1 # XXX
    g['move_number']         = game.move_number
    g['resigned_by_id']      = game.resigned_by_id
    g['result']              = game.result
    g['room_id']             = game.room.id
    g['started_at']          = game.started_at
    g['state']               = game.state
    g['timed']               = game.timed
    g['token']               = game.token
    g['turn']                = game.turn
    g['turn_started_at']     = game.turn_started_at
    g['updated_at']          = game.updated_at
    if game.user_done_scoring is None:
        g['user_done_scoring'] = None
    else:
        g['user_done_scoring']   = game.user_done_scoring.id
    g['version']             = game.version
    g['white_capture_count'] = game.white_capture_count
    g['white_player_id']     = game.white_player.id
    g['white_player_rank']   = game.white_player.rank
    g['white_seconds_left']  = game.white_seconds_left
    g['scoring_info']        = s

    msg = {}
    msg['sgf'] = '(;FF[4]GM[1]CA[UTF-8]AP[GoShrine:1.0]RU[Japanese]\nSZ[19]\nHA[9]\nKM[0.5]\nPC[GoShrine - http://goshrine.com]\nPW[Kairi]\nWR[?]\nPB[oxlade]\nBR[?]\nDT[2017-03-25]\nTM[1800]\nOT[5x30 byo-yomi]\nRE[W+14.5]\nAB[dd][jd][pd][dj][jj][pj][dp][jp][pp]\n;W[qf];B[pf];W[pg];B[of];W[qd];B[qc];W[qe];B[pc];W[pn];B[ph];W[og];B[qh];W[qg];B[qm];W[qn];B[pm];W[on];B[np];W[om];B[rn];W[ro];B[rm];W[qp];B[qq];W[rq];B[qr];W[ok];B[oj];W[nj];B[po];W[qo];B[lk];W[ni];B[rj];W[nf];B[nd];W[cn];B[cl];W[cq];B[cp];W[dq];B[fp];W[ep];B[eo];W[eq];B[fo];W[do];B[co];W[dn];B[bn];W[bm];B[bo];W[cm];B[bq];W[br];B[ap];W[an];B[ar];W[bs];B[bl];W[fm];B[fq];W[am];B[dl];W[em];B[nk];W[mk];B[nl];W[ml];B[nm];W[mn];B[ol];W[mm];B[lj];W[nn];B[pk];W[lp];B[mq];W[lq];B[oq];W[jn];B[ko];W[mp];B[mr];W[lr];B[jr];W[iq];B[jq];W[ho];B[er];W[dr];B[ds];W[cr];B[fr];W[ao];B[ip];W[hp];B[hq];W[cf];B[ce];W[df];B[fc];W[ei];B[ch];W[dh];B[di];W[eh];B[ej];W[fj];B[fk];W[gk];B[fi];W[gj];B[cg];W[ff];B[dg];W[eg];B[bf];W[jf];B[de];W[id];B[jc];W[je];B[ic];W[hd];B[ef];W[gg];B[gl];W[fl];B[gi];W[ik];B[fg];W[fh];B[gh];W[fg];B[hj];W[hk];B[kn];W[km];B[kl];W[jm];B[lg];W[lf];B[kg];W[ld];B[ne];W[mg];B[jh];W[ii];B[mh];W[nh];B[ki];W[mi];B[lh];W[mc];B[nc];W[hc];B[lb];W[mb];B[hb];W[gb];B[lc];W[md];B[ja];W[ha];B[ib];W[gc];B[kb];W[li];B[me];W[le];B[mf];W[ng];B[ih];W[hh];B[jg];W[ji];B[fe];W[ge];B[fb];W[fd];B[fa];W[ga];B[ed];W[ob];B[nb];W[na];B[pb];W[pe];B[oc];W[oa];B[pa];W[ma];B[oe];W[rc];B[rb];W[sd];B[sb];W[al];B[ie];W[if];B[bj];W[aj];B[ai];W[ak];B[bi];W[rr];B[gd];W[or];B[pr];W[ms];B[nr];W[rh];B[ri];W[sh];B[si];W[rg];B[sc];W[rd];B[gn];W[hn];B[gm];W[ek];B[ks];W[ns];B[os];W[ls];B[ln];W[no];B[lm];W[ll];B[rs];W[oo];B[op];W[gq];B[hr];W[gp];B[gr];W[kd];B[la];W[kr];B[js];W[dk];B[ck];W[oi];B[pi];W[sn];B[sm];W[so];B[sr];W[sq];B[el];W[fk];B[hl];W[il];B[io];W[in];B[lo];W[mo];B[en];W[dm];B[fd];W[bk];B[cj];W[ss];B[qs];W[sr];B[es];W[hm];B[cs];W[bp];B[go];W[jo];B[kp];W[fn];B[ia];W[he];B[];W[];TW[aq][bq][ap][ar][as][bn][bo][co][cp][dp][gf][hf][hg][ig][jg][ih][kg][jh][lg][kf][kh][lh][ke][ki][mh][kj][jj][lj][kk][ij][jk][mj][lk][kl][hj][jl][hi][gi][fi][gh][ie][im][re][se][rf][sf][sg][rp][sp]TB[aa][ba][ab][ca][bb][ac][da][cb][bc][ad][ea][db][cc][bd][ae][eb][dc][cd][be][af][ec][ag][bg][ah][bh][cf][df][ci][ee][fs][gs][hs][is][ir][iq][jb][ka][nq][od][ok][or][pl][ql][rl][qk][sl][rk][qj][sk][qi][sj][pq][ps][qa][ra][qb][sa])'
    msg['game'] = g
    msg['allow_undo'] = True

    params = { 'separators': (',', ':') }
    return JsonResponse(msg, safe=False, json_dumps_params=params)

# XXX: called by application.js shit.  Later we need to set the CSRF
# cookie.
# https://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django
@csrf_exempt
def match_create(request):
    if request.method != 'POST':
        raise Http404()

    form = MatchCreateForm(request.POST)
    if not form.is_valid():
        raise Http404()

    target_user_id = form.cleaned_data['challenged_player_id']
    room_id        = form.cleaned_data['room_id']

    try:
        with transaction.atomic():
            target_user = User.objects.get(pk=target_user_id)
            room        = Room.objects.get(pk=room_id)
    except (User.DoesNotExist, Room.DoesNotExist):
       raise Http404()

    context = {
        'target_user': target_user,
        'room'       : room
    }
    return render(request, 'game/match_create.html', context)

@csrf_exempt
def match_propose(request):
    if request.method != 'GET':
        raise Http404()

    form = MatchProposeForm(request.GET)
    if not form.is_valid():
        raise Http404()

    if request.user is None or not request.user.is_authenticated:
        raise Http404()

    room_id              = form.cleaned_data['room_id']
    challenged_player_id = form.cleaned_data['challenged_player_id']

    # Check if the room and the challenged player exist.  If not we simply
    # 404 at this time.
    # XXX: later can check if player is in the room.
    try:
        with transaction.atomic():
            room = Room.objects.get(pk=room_id)
            cp   = User.objects.get(pk=challenged_player_id)
    except (User.DoesNotExist, Room.DoesNotExist):
        raise Http404()

    # Send the challenge request to the room
    channel_layer = get_channel_layer()

    match_request = {
        'proposed_by_id': request.user.id
    }

    response = {
        'type'         : 'match_requested',
        'html'         : '<h1>kak</h1>',
        'game_token'   : 123,
        'match_request': match_request
    }

    # Relay the message to everyone in the group, including ourselves.
    async_to_sync(channel_layer.group_send)(
            f"room_{room_id}_user_{challenged_player_id}", {
                'type'   : 'room.xmit.event',
                'stream' : f'user_{challenged_player_id}',
                'payload': response
        }
    )

    # The response back to the client requesting the game.
    # 'errors' can be a list of messages like ['a', 'b']
    # 'result' is a good result
    response = {
        'result': f'A challenge has been sent to {cp.login}...'
    }

    params = { 'separators': (',', ':') }
    return JsonResponse(response, safe=False, json_dumps_params=params)

#    /match/propose?challenged_player_id=1&room_id=1&black_player_id=2&white_player_id=1&board_size=19&handicap=0&timed=true&main_time=30&byo_yomi=true

    print(request)
