from json import loads
from subprocess import Popen, STDOUT
import os

from fpyf import Routing, Application, expose

REFS = {
    'refs/heads/master': ('master', '~/sites/halfway_test'),
    'refs/heads/deploy': ('deploy', '~/sites/halfway'),
}

def quick_call(command):
    return Popen(command, shell=True, stderr=STDOUT).communicate()[0]

def update(ref):
    if not ref:
        return
    info = REFS.get(ref)
    if not info:
        return
    branch, path = info
    print 'Reloading: repo %s, branch %s' % (path, branch)
    os.chdir(os.path.expanduser(path))
    print quick_call('git reset --hard')
    print quick_call('git checkout ' + branch)
    print quick_call('git pull origin')

@expose()
def handle_prh(request, proto, **kwargs):
    payload = request.POST.get1('payload')
    if not payload:
        return 'How can I help you?'
    payload = loads(payload)
    update(payload.get('ref'))
    return ''

route = (
    # Mistype, made it backward compatible...
    (r'_gith?ub_prh/?$', handle_prh),
)
application = Application(Routing(route), default_type='text/plain', mountpoint='/dyn/')
