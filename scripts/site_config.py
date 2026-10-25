"""One public URL for Pages builds and exports to a domain's root."""
import os
import re
from urllib.parse import urlsplit, urlunsplit

DEFAULT_SITE = 'https://azrielchoerulhakim.github.io/nalar_hakim/'


def normalize_site_url(value):
    """Reject URL characters that could become HTML, paths or config directives."""
    if not value or value != value.strip() or re.search(r'[\s\\<>"\'`%]', value):
        raise ValueError('NH_SITE_URL must be an HTTPS origin with an optional plain path')
    parsed = urlsplit(value)
    if (parsed.scheme != 'https' or not parsed.hostname or parsed.username or
            parsed.password or parsed.query or parsed.fragment or parsed.port is not None or
            parsed.netloc.lower() != parsed.hostname.lower()):
        raise ValueError('NH_SITE_URL must use HTTPS without credentials, a port, query or fragment')
    if not re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?', parsed.hostname):
        raise ValueError('NH_SITE_URL requires a DNS hostname')
    path = parsed.path or '/'
    if not re.fullmatch(r'/[A-Za-z0-9_/-]*', path) or '//' in path:
        raise ValueError('NH_SITE_URL path may contain letters, digits, _, - and / only')
    return urlunsplit(('https', parsed.hostname.lower(), path.rstrip('/') + '/', '', ''))


SITE = normalize_site_url(os.environ.get('NH_SITE_URL', DEFAULT_SITE))
SITE_PATH = urlsplit(SITE).path
