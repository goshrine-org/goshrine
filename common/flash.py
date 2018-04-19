FLASH_KEY = '_flashes'

def flashes_set(request, flashes):
    if not hasattr(request, 'session'):
        return False

    request.session[FLASH_KEY] = flashes
    return True

def flashes_get(request):
    if not hasattr(request, 'session'):
        return None

    if not FLASH_KEY in request.session:
        return None

    flashes = request.session[FLASH_KEY]
    del request.session[FLASH_KEY]
    return flashes
