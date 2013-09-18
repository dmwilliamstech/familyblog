from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(r'^(?P<id>[-\d]+)/$',
        'django_blog.views.author_detail',
        name='blog_author_detail'),
)
