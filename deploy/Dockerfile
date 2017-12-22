FROM ubuntu:17.04
MAINTAINER SpaceInvasionLab <spaceinvasionlab@yandex.ru>

COPY . /var/www/SpaceInvasion/
WORKDIR /var/www/SpaceInvasion

RUN apt update &&\
    apt install software-properties-common nginx -y &&\
    add-apt-repository ppa:certbot/certbot -y &&\
    apt update &&\
    apt install python-certbot-nginx -y &&\
    mkdir -p /etc/nginx &&\
    mkdir -p /etc/ssl/certs &&\
    mkdir -p /var/log/SpaceInvasion &&\
    bin/gen_nginx_config -s nginx -c conf/config.ini -t conf/proxy_params -o /etc/nginx/proxy_params &&\
    bin/gen_nginx_config -s nginx -c conf/config.ini -t conf/nginx.conf -o /etc/nginx/nginx.conf &&\
    certbot -n --nginx --nginx-server-root /etc/nginx/ -d www.space-invasion.ru -d space-invasion.ru --agree-tos --email spaceinvasionlab@yandex.ru &&\
    crontab -l | cat - deploy/crontab | crontab -

CMD service nginx start && npm i && npm run webpack
