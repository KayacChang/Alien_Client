FROM nginx
MAINTAINER scott.chen@sixonetech.com
RUN mkdir -p /usr/share/game/alien
RUN mkdir -p /etc/nginx/ssl
COPY nginx.conf /etc/nginx/nginx.conf
COPY alien-web.conf /etc/nginx/conf.d/default.conf
COPY weberverbygo_proxy.conf /etc/nginx/conf.d/weberverbygo_proxy.conf
COPY project /usr/share/game/alien
COPY project/locales /usr/share/game/alien/dist/locales
VOLUME ["/usr/share/game/alien/dist"]
VOLUME ["/etc/nginx/conf.d"]
VOLUME ["/etc/nginx/ssl"]
EXPOSE 80
EXPOSE 443
EXPOSE 8001
