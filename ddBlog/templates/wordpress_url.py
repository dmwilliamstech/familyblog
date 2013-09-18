from django import template
import urllib

register = template.Library()

def get_post_url(value):
    date = value.publish_date
    return '/blog/%d/%02d/%02d/%s/' % (date.year, date.month, date.day, value.slug)

def get_encoded_post_url(value, arg):
    url = '%s%s' % (arg[:-1], get_post_url(value))
    return urllib.quote_plus(url)

register.filter('get_post_url', get_post_url)
register.filter('get_encoded_post_url', get_encoded_post_url)