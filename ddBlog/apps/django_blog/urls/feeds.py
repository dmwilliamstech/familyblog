from django.conf.urls import patterns, url

from django_blog.feeds import LatestEntries


urlpatterns = patterns('',
    url(r'^$', LatestEntries(), name='blog_feed'),)
